const { prisma } = require('../utils/prismaClient');

const TASK_STATUS = {
    PENDING: 'pending',
    INPROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

const taskService = {
    // Helper to create notifications
    async createNotifications(tx, notifications) {
        if (!notifications || notifications.length === 0) return;

        const notificationData = notifications.map(notif => ({
            id: `notif_${Date.now()}_${notif.userId}_${notif.taskId || ''}`,
            userId: notif.userId,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            timestamp: new Date(),
            isRead: false
        }));

        await tx.notification.createMany({ data: notificationData });
    },

    // Helper to create activity log
    async createActivity(tx, { type, title, message, metadata }) {
        await tx.activity.create({
            data: {
                id: `activity_${Date.now()}_${metadata.taskId || Date.now()}`,
                type,
                title,
                message,
                timestamp: new Date(),
                metadata
            }
        });
    },

    // Helper to get user info (farmId and role)
    async getUserInfoOrFail(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { farmId: true, role: true, name: true },
        });

        if (!user?.farmId) {
            throw new Error('User is not associated with any farm');
        }
        return user;
    },

    // Helper to get farmId only (kept for backward compatibility)
    async getFarmIdOrFail(userId) {
        const user = await this.getUserInfoOrFail(userId);
        return user.farmId;
    },

    // Get task by id with role-based access control
    async getTaskById(userId, taskId) {
        const user = await this.getUserInfoOrFail(userId);

        const whereClause = {
            id: taskId,
            farmId: user.farmId,
        };

        // If worker, ensure they're assigned to this task
        if (user.role === 'worker') {
            whereClause.taskAssignments = {
                some: { workerId: userId }
            };
        }

        const task = await prisma.task.findFirst({
            where: whereClause,
            include: {
                field: {
                    select: {
                        id: true,
                        name: true,
                        cropType: true,
                        size: true,
                        status: true
                    }
                },
                taskAssignments: {
                    include: {
                        worker: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });

        if (!task) throw new Error('Task not found or access denied');
        return task;
    },

    // Create task (only admin/farmer can create)
    async createTask(
        userId,
        { title, description, status, priority, dueDate, fieldId, assignedWorkerIds = [], notes }
    ) {
        const user = await this.getUserInfoOrFail(userId);

        // Only admin can create tasks
        if (user.role === 'worker') {
            throw new Error('Workers cannot create tasks');
        }

        return prisma.$transaction(async (tx) => {
            const task = await tx.task.create({
                data: {
                    title,
                    description,
                    status: status || 'pending',
                    priority: priority || 'medium',
                    dueDate: new Date(dueDate),
                    notes,
                    farmId: user.farmId,
                    fieldId,
                },
            });

            // Assign workers if provided
            if (assignedWorkerIds.length) {
                // Verify all workers belong to the same farm
                const workers = await tx.user.findMany({
                    where: {
                        id: { in: assignedWorkerIds },
                        farmId: user.farmId,
                        role: 'worker'
                    }
                });

                if (workers.length !== assignedWorkerIds.length) {
                    throw new Error('Some workers not found or do not belong to this farm');
                }

                await tx.taskAssignment.createMany({
                    data: assignedWorkerIds.map((workerId) => ({
                        taskId: task.id,
                        workerId,
                    })),
                });

                // Create notifications for assigned workers
                await this.createNotifications(
                    tx,
                    assignedWorkerIds.map(workerId => ({
                        userId: workerId,
                        taskId: task.id,
                        type: 'task_assigned',
                        title: 'New Task Assigned',
                        message: `You have been assigned to task: ${title}`
                    }))
                );
            }

            // Create activity log
            await this.createActivity(tx, {
                type: 'task_created',
                title: 'Task Created',
                message: `${user.name} created task: ${title}`,
                metadata: {
                    taskId: task.id,
                    userId: userId,
                    farmId: user.farmId
                }
            });

            return task;
        });
    },

    // Update task (only admin/farmer can update)
    async updateTask(
        userId,
        taskId,
        { title, description, status, priority, dueDate, fieldId, assignedWorkerIds, notes }
    ) {
        const user = await this.getUserInfoOrFail(userId);

        // Only admin can update tasks
        if (user.role === 'worker') {
            throw new Error('Workers cannot update tasks. Use updateTaskStatus instead.');
        }

        return prisma.$transaction(async (tx) => {
            const task = await tx.task.updateMany({
                where: { id: taskId, farmId: user.farmId },
                data: {
                    ...(title && { title }),
                    ...(description !== undefined && { description }),
                    ...(status && { status }),
                    ...(priority && { priority }),
                    ...(dueDate && { dueDate: new Date(dueDate) }),
                    ...(fieldId !== undefined && { fieldId }),
                    ...(notes !== undefined && { notes }),
                },
            });

            if (!task.count) throw new Error('Task not found');

            // Update worker assignments if provided
            if (Array.isArray(assignedWorkerIds)) {
                // Get old assignments
                const oldAssignments = await tx.taskAssignment.findMany({
                    where: { taskId },
                    select: { workerId: true }
                });
                const oldWorkerIds = oldAssignments.map(a => a.workerId);

                // Delete old assignments
                await tx.taskAssignment.deleteMany({ where: { taskId } });

                if (assignedWorkerIds.length) {
                    // Verify workers
                    const workers = await tx.user.findMany({
                        where: {
                            id: { in: assignedWorkerIds },
                            farmId: user.farmId,
                            role: 'worker'
                        }
                    });

                    if (workers.length !== assignedWorkerIds.length) {
                        throw new Error('Some workers not found or do not belong to this farm');
                    }

                    // Create new assignments
                    await tx.taskAssignment.createMany({
                        data: assignedWorkerIds.map((workerId) => ({
                            taskId,
                            workerId,
                        })),
                    });

                    // Notify newly assigned workers
                    const newWorkerIds = assignedWorkerIds.filter(id => !oldWorkerIds.includes(id));
                    if (newWorkerIds.length > 0) {
                        await this.createNotifications(
                            tx,
                            newWorkerIds.map(workerId => ({
                                userId: workerId,
                                taskId,
                                type: 'task_assigned',
                                title: 'Task Assigned',
                                message: `You have been assigned to task: ${title || 'Updated task'}`
                            }))
                        );
                    }
                }
            }

            // Create activity log
            await this.createActivity(tx, {
                type: 'task_updated',
                title: 'Task Updated',
                message: `${user.name} updated task #${taskId}`,
                metadata: {
                    taskId,
                    userId: userId,
                    farmId: user.farmId
                }
            });

            return tx.task.findUnique({
                where: { id: taskId },
                include: {
                    field: true,
                    taskAssignments: {
                        include: {
                            worker: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });
        });
    },

    // Get tasks with role-based filtering
    async getTasks(
        userId,
        {
            page = 1,
            pageSize = 10,
            status,
            priority,
            fieldId,
            search,
            sortBy = 'dueDate',
            sortOrder = 'asc'
        }
    ) {
        const user = await this.getUserInfoOrFail(userId);

        // Base where clause
        const where = {
            farmId: user.farmId,
            ...(status && { status }),
            ...(priority && { priority }),
            ...(fieldId && { fieldId }),
            ...(search && {
                title: {
                    contains: search,
                    mode: 'insensitive'
                }
            })
        };

        // If user is a worker, only show their assigned tasks
        if (user.role === 'worker') {
            where.taskAssignments = {
                some: { workerId: userId }
            };
        }

        const [tasks, total] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    field: {
                        select: {
                            id: true,
                            name: true,
                            cropType: true
                        }
                    },
                    taskAssignments: {
                        include: {
                            worker: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.task.count({ where }),
        ]);

        return {
            data: tasks,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    // Task statistics with role-based filtering
    async getTaskStatistics(userId) {
        const user = await this.getUserInfoOrFail(userId);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Base where clause for all queries
        const baseWhere = {
            farmId: user.farmId,
        };

        // If worker, add assignment filter
        if (user.role === 'worker') {
            baseWhere.taskAssignments = {
                some: { workerId: userId }
            };
        }

        const [
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            dueTodayTasks,
            newTasksToday,
            in_progressToday,
            comleted_today,
        ] = await prisma.$transaction([
            prisma.task.count({ where: baseWhere }),
            prisma.task.count({ where: { ...baseWhere, status: TASK_STATUS.COMPLETED } }),
            prisma.task.count({ where: { ...baseWhere, status: TASK_STATUS.INPROGRESS } }),
            prisma.task.count({ where: { ...baseWhere, status: TASK_STATUS.PENDING } }),
            prisma.task.count({
                where: {
                    ...baseWhere,
                    dueDate: { gte: todayStart, lte: todayEnd },
                },
            }),
            prisma.task.count({ where: { ...baseWhere, createdAt: { gte: todayStart, lte: todayEnd } } }),
            prisma.task.count({ where: { ...baseWhere, status: TASK_STATUS.INPROGRESS, updatedAt: { gte: todayStart, lte: todayEnd } } }),
            prisma.task.count({ where: { ...baseWhere, status: TASK_STATUS.COMPLETED, updatedAt: { gte: todayStart, lte: todayEnd } } }),
        ]);

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            dueTodayTasks,
            newTasksToday,
            in_progressToday,
            comleted_today
        };
    },

    // Delete task (only admin/farmer)
    async deleteTask(userId, taskId) {
        const user = await this.getUserInfoOrFail(userId);

        // Only admin can delete tasks
        if (user.role === 'worker') {
            throw new Error('Workers cannot delete tasks');
        }

        return prisma.$transaction(async (tx) => {
            // Fetch task details before deletion to get fieldId
            const task = await tx.task.findFirst({
                where: { id: taskId, farmId: user.farmId },
                select: { id: true, title: true, fieldId: true }
            });

            if (!task) {
                throw new Error('Task not found or could not be deleted');
            }

            await tx.task.delete({
                where: { id: taskId },
            });

            // Create activity log
            await this.createActivity(tx, {
                type: 'task_deleted',
                title: 'Task Deleted',
                message: `${user.name} deleted task: ${task.title}`,
                metadata: {
                    taskId,
                    fieldId: task.fieldId,
                    userId: userId,
                    farmId: user.farmId
                }
            });

            return true;
        });
    },

    // Add task assignment (only admin/farmer)
    async addTaskAssignment(userId, taskId, { workersIds }) {
        const user = await this.getUserInfoOrFail(userId);

        // Only admin can assign tasks
        if (user.role === 'worker') {
            throw new Error('Workers cannot assign tasks');
        }

        return prisma.$transaction(async (tx) => {
            // Verify task exists and belongs to farm
            const task = await tx.task.findFirst({
                where: { id: taskId, farmId: user.farmId }
            });

            if (!task) throw new Error('Task not found');

            // Verify workers belong to the same farm
            const workers = await tx.user.findMany({
                where: {
                    id: { in: workersIds },
                    farmId: user.farmId,
                    role: 'worker'
                }
            });

            if (!workers || workers.length === 0) {
                throw new Error('Workers not found');
            }

            if (workers.length !== workersIds.length) {
                throw new Error('Some workers not found or do not belong to this farm');
            }

            const assignments = workers.map(worker => ({
                taskId,
                workerId: worker.id
            }));

            const result = await tx.taskAssignment.createMany({
                data: assignments,
                skipDuplicates: true
            });

            // Create notifications for assigned workers
            await this.createNotifications(
                tx,
                workers.map(worker => ({
                    userId: worker.id,
                    taskId,
                    type: 'task_assigned',
                    title: 'Task Assigned',
                    message: `You have been assigned to task: ${task.title}`
                }))
            );

            return result;
        });
    },

    // Update task status (for workers)
    async updateTaskStatus(userId, taskId, { status, notes, startedAt }) {
        const user = await this.getUserInfoOrFail(userId);

        const updateData = {
            status,
            ...(notes && { notes }),
            ...(startedAt && { updatedAt: new Date(startedAt) })
        };

        return prisma.$transaction(async (tx) => {
            // Check if task exists and user has access
            const whereClause = {
                id: taskId,
                farmId: user.farmId
            };

            // If worker, ensure they're assigned to this task
            if (user.role === 'worker') {
                const taskAssignment = await tx.taskAssignment.findFirst({
                    where: {
                        taskId: taskId,
                        workerId: userId
                    }
                });

                if (!taskAssignment) {
                    throw new Error('Task not found or you are not assigned to this task');
                }
            }

            const task = await tx.task.updateMany({
                where: whereClause,
                data: updateData
            });

            if (!task.count) throw new Error('Task not found');

            // Create notification for farm admin when task is completed
            if (status === 'completed') {
                const admins = await tx.user.findMany({
                    where: {
                        farmId: user.farmId,
                        role: 'admin'
                    }
                });

                const taskDetails = await tx.task.findUnique({
                    where: { id: taskId },
                    select: { title: true }
                });

                await this.createNotifications(
                    tx,
                    admins.map(admin => ({
                        userId: admin.id,
                        taskId,
                        type: 'taskCompletion',
                        title: 'Task Completed',
                        message: `${user.name} completed task: ${taskDetails?.title || 'Task'}`
                    }))
                );
            }

            // Create activity log
            await this.createActivity(tx, {
                type: 'task_status_updated',
                title: 'Task Status Updated',
                message: `${user.name} updated task #${taskId} status to ${status}`,
                metadata: {
                    taskId,
                    userId: userId,
                    farmId: user.farmId,
                    status
                }
            });

            return tx.task.findUnique({
                where: { id: taskId },
                include: {
                    taskAssignments: {
                        include: {
                            worker: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });
        });
    }
};

module.exports = taskService;