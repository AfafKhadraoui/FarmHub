const { prisma } = require('../utils/prismaClient');

const WorkerService = {
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
                id: `activity_${Date.now()}_${metadata.workerId || metadata.taskId || Date.now()}`,
                type,
                title,
                message,
                timestamp: new Date(),
                metadata
            }
        });
    },

    // Helper to get farmId or throw error
    async getFarmIdOrFail(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { farmId: true, name: true },
        });

        if (!user?.farmId) {
            throw new Error('User is not associated with any farm');
        }
        return { farmId: user.farmId, userName: user.name };
    },

    // List workers with task statistics
    async getWorkers(
        userId,
        {
            page = 1,
            pageSize = 10,
            search,
        }
    ) {
        const { farmId } = await this.getFarmIdOrFail(userId);

        const where = {
            farmId,
            role: 'worker',
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        phone: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            })
        };

        const [workers, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                    taskAssignments: {
                        include: {
                            task: {
                                select: {
                                    id: true,
                                    status: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.user.count({ where }),
        ]);

        // Transform data to include task statistics
        const items = workers.map(worker => {
            const assignedTasks = worker.taskAssignments.length;
            const completedTasks = worker.taskAssignments.filter(
                assignment => assignment.task.status === 'completed'
            ).length;

            // Calculate performance percentage
            const performancePercent = assignedTasks > 0
                ? Math.round((completedTasks / assignedTasks) * 100)
                : 0;

            // Generate avatar initials
            const nameParts = worker.name.trim().split(' ');
            const avatarInitials = nameParts.length >= 2
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0].substring(0, 2).toUpperCase();

            return {
                id: worker.id,
                name: worker.name,
                email: worker.email,
                phone: worker.phone,
                role: worker.role,
                createdAt: worker.createdAt,
                assignedTasks,
                completedTasks,
                performancePercent,
                avatarInitials
            };
        });

        return {
            items,
            pagination: {
                page,
                limit: pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    // Get single worker by id with detailed statistics
    async getWorkerById(userId, workerId) {
        const { farmId } = await this.getFarmIdOrFail(userId);

        const worker = await prisma.user.findFirst({
            where: {
                id: workerId,
                farmId,
                role: 'worker'
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                taskAssignments: {
                    include: {
                        task: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                status: true,
                                priority: true,
                                dueDate: true,
                                field: {
                                    select: {
                                        id: true,
                                        name: true,
                                        cropType: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        task: {
                            dueDate: 'asc'
                        }
                    }
                }
            }
        });

        if (!worker) {
            throw new Error('Worker not found');
        }

        // Calculate statistics
        const assignedTasks = worker.taskAssignments.length;
        const completedTasks = worker.taskAssignments.filter(
            assignment => assignment.task.status === 'completed'
        ).length;
        const pendingTasks = worker.taskAssignments.filter(
            assignment => assignment.task.status === 'pending'
        ).length;
        const inProgressTasks = worker.taskAssignments.filter(
            assignment => assignment.task.status === 'in_progress'
        ).length;
        const performancePercent = assignedTasks > 0
            ? Math.round((completedTasks / assignedTasks) * 100)
            : 0;

        // Generate avatar initials
        const nameParts = worker.name.trim().split(' ');
        const avatarInitials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : nameParts[0].substring(0, 2).toUpperCase();

        return {
            id: worker.id,
            name: worker.name,
            email: worker.email,
            phone: worker.phone,
            role: worker.role,
            createdAt: worker.createdAt,
            avatarInitials,
            statistics: {
                assignedTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                performancePercent
            },
            tasks: worker.taskAssignments.map(assignment => assignment.task)
        };
    },

    // Get worker statistics
    async getWorkerStatistics(userId) {
        const { farmId } = await this.getFarmIdOrFail(userId);

        const workers = await prisma.user.findMany({
            where: {
                farmId,
                role: 'worker'
            },
            include: {
                taskAssignments: {
                    include: {
                        task: {
                            select: {
                                status: true
                            }
                        }
                    }
                }
            }
        });

        const totalWorkers = workers.length;
        const totalAssignedTasks = workers.reduce(
            (sum, worker) => sum + worker.taskAssignments.length,
            0
        );
        const totalCompletedTasks = workers.reduce(
            (sum, worker) => sum + worker.taskAssignments.filter(
                a => a.task.status === 'completed'
            ).length,
            0
        );
        const averagePerformance = totalWorkers > 0 && totalAssignedTasks > 0
            ? Math.round((totalCompletedTasks / totalAssignedTasks) * 100)
            : 0;

        return {
            totalWorkers,
            totalAssignedTasks,
            totalCompletedTasks,
            averagePerformance
        };
    },

    // Delete worker
    async deleteWorker(userId, workerId) {
        const { farmId, userName } = await this.getFarmIdOrFail(userId);

        return prisma.$transaction(async (tx) => {
            // Verify worker exists and belongs to the farm
            const worker = await tx.user.findFirst({
                where: {
                    id: workerId,
                    farmId,
                    role: 'worker'
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (!worker) {
                throw new Error('Worker not found or does not belong to your farm');
            }

            // Delete task assignments first (cascade)
            await tx.taskAssignment.deleteMany({
                where: { workerId }
            });

            // Delete the worker
            await tx.user.delete({
                where: { id: workerId }
            });

            // Create activity log
            await this.createActivity(tx, {
                type: 'worker_deleted',
                title: 'Worker Deleted',
                message: `${userName} deleted worker: ${worker.name}`,
                metadata: {
                    workerId,
                    userId,
                    farmId
                }
            });

            return { success: true, message: 'Worker deleted successfully' };
        });
    },

    // Update worker
    async updateWorker(userId, workerId, { name, email, phone }) {
        const { farmId, userName } = await this.getFarmIdOrFail(userId);

        return prisma.$transaction(async (tx) => {
            // Verify worker exists and belongs to the farm
            const existingWorker = await tx.user.findFirst({
                where: {
                    id: workerId,
                    farmId,
                    role: 'worker'
                }
            });

            if (!existingWorker) {
                throw new Error('Worker not found or does not belong to your farm');
            }

            // Check if email is being changed and if it's already in use
            if (email && email !== existingWorker.email) {
                const emailExists = await tx.user.findUnique({
                    where: { email }
                });

                if (emailExists) {
                    throw new Error('Email is already in use by another user');
                }
            }

            // Update worker data
            const updatedData = {};
            if (name !== undefined) updatedData.name = name;
            if (email !== undefined) updatedData.email = email;
            if (phone !== undefined) updatedData.phone = phone;

            const updatedWorker = await tx.user.update({
                where: { id: workerId },
                data: updatedData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true
                }
            });

            // Create activity log
            await this.createActivity(tx, {
                type: 'worker_updated',
                title: 'Worker Updated',
                message: `${userName} updated worker: ${updatedWorker.name}`,
                metadata: {
                    workerId,
                    userId,
                    farmId
                }
            });

            return updatedWorker;
        });
    },

    // Assign single task to worker
    async assignTaskToWorker(userId, workerId, taskId) {
        const { farmId, userName } = await this.getFarmIdOrFail(userId);

        return prisma.$transaction(async (tx) => {
            // Verify worker exists and belongs to the farm
            const worker = await tx.user.findFirst({
                where: {
                    id: workerId,
                    farmId,
                    role: 'worker'
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (!worker) {
                throw new Error('Worker not found or does not belong to your farm');
            }

            // Verify task exists and belongs to the farm
            const task = await tx.task.findFirst({
                where: {
                    id: taskId,
                    farmId
                },
                select: {
                    id: true,
                    title: true
                }
            });

            if (!task) {
                throw new Error('Task not found or does not belong to your farm');
            }

            // Check if already assigned
            const existingAssignment = await tx.taskAssignment.findUnique({
                where: {
                    taskId_workerId: {
                        taskId,
                        workerId
                    }
                }
            });

            if (existingAssignment) {
                return {
                    success: true,
                    alreadyAssigned: true,
                    message: 'Task is already assigned to this worker'
                };
            }

            // Create task assignment
            await tx.taskAssignment.create({
                data: {
                    taskId,
                    workerId
                }
            });

            // Create notification for the worker
            await this.createNotifications(tx, [{
                userId: workerId,
                taskId,
                type: 'task_assigned',
                title: 'New Task Assigned',
                message: `You have been assigned to task: ${task.title}`
            }]);

            // Create activity log
            await this.createActivity(tx, {
                type: 'task_assigned',
                title: 'Task Assigned',
                message: `${userName} assigned task "${task.title}" to ${worker.name}`,
                metadata: {
                    taskId,
                    workerId,
                    userId,
                    farmId
                }
            });

            return {
                success: true,
                alreadyAssigned: false,
                message: 'Task assigned to worker successfully'
            };
        });
    },

    // Unassign task from worker
    async unassignTaskFromWorker(userId, workerId, taskId) {
        const { farmId, userName } = await this.getFarmIdOrFail(userId);

        return prisma.$transaction(async (tx) => {
            // Verify worker and task belong to the farm
            const worker = await tx.user.findFirst({
                where: {
                    id: workerId,
                    farmId,
                    role: 'worker'
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (!worker) {
                throw new Error('Worker not found or does not belong to your farm');
            }

            const task = await tx.task.findFirst({
                where: {
                    id: taskId,
                    farmId
                },
                select: {
                    id: true,
                    title: true
                }
            });

            if (!task) {
                throw new Error('Task not found or does not belong to your farm');
            }

            // Delete the assignment
            const deleted = await tx.taskAssignment.deleteMany({
                where: {
                    taskId,
                    workerId
                }
            });

            if (deleted.count === 0) {
                throw new Error('Task assignment not found');
            }

            // Create notification for the worker
            await this.createNotifications(tx, [{
                userId: workerId,
                taskId,
                type: 'task_unassigned',
                title: 'Task Unassigned',
                message: `You have been unassigned from task: ${task.title}`
            }]);

            // Create activity log
            await this.createActivity(tx, {
                type: 'task_unassigned',
                title: 'Task Unassigned',
                message: `${userName} unassigned task "${task.title}" from ${worker.name}`,
                metadata: {
                    taskId,
                    workerId,
                    userId,
                    farmId
                }
            });

            return {
                success: true,
                message: 'Task unassigned successfully'
            };
        });
    },

    // Get workers available for assignment (not already assigned to specific task)
    async getAvailableWorkersForTask(userId, taskId) {
        const { farmId } = await this.getFarmIdOrFail(userId);

        // Verify task exists and belongs to farm
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                farmId
            }
        });

        if (!task) {
            throw new Error('Task not found or does not belong to your farm');
        }

        // Get all workers in the farm
        const allWorkers = await prisma.user.findMany({
            where: {
                farmId,
                role: 'worker'
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                taskAssignments: {
                    where: {
                        taskId
                    },
                    select: {
                        id: true
                    }
                }
            }
        });

        // Filter out workers already assigned to this task
        const availableWorkers = allWorkers
            .filter(worker => worker.taskAssignments.length === 0)
            .map(worker => ({
                id: worker.id,
                name: worker.name,
                email: worker.email,
                phone: worker.phone
            }));

        return availableWorkers;
    }
};

module.exports = WorkerService;