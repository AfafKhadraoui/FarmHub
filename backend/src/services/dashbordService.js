const { prisma } = require('../utils/prismaClient');
const weatherService = require('./weatherServices');

const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

const FIELD_STATUS = {
    IDLE: 'idle',
    PLANTED: 'planted',
    GROWING: 'growing',
    HARVESTING: 'harvesting'
};

const dashboardService = {
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

    // Helper to get weather data for a farm
    async getWeatherForFarm(farmId) {
        try {
            const farm = await prisma.farm.findUnique({
                where: { id: farmId },
                select: { location: true }
            });

            if (farm && farm.location) {
                const coords = await weatherService.getCoordinates(farm.location);
                const rawData = await weatherService.getWeatherData(coords.latitude, coords.longitude);
                return weatherService.formatForFarmerCurrent(rawData);
            }
        } catch (error) {
            console.error("Weather fetch error:", error.message);
        }

        // Return fallback weather data
        return {
            temperature: 0,
            condition: "Unavailable",
            icon: "cloudy",
            feelsLike: 0,
            humidity: 0,
            windSpeedKmh: 0,
            windDirection: "N/A",
            uvIndex: 0,
            uvLevel: "low"
        };
    },

    // Get dashboard overview statistics
    async getOverview(userId) {
        const user = await this.getUserInfoOrFail(userId);

        // Date ranges
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Base where clause for tasks
        const taskWhereClause = {
            farmId: user.farmId,
        };

        // If worker, only show their assigned tasks
        if (user.role === 'worker') {
            taskWhereClause.taskAssignments = {
                some: { workerId: userId }
            };
        }

        // Field statistics
        const [
            totalFields,
            activeFields,
            fieldsThisMonth,
            fieldsLastMonth
        ] = await prisma.$transaction([
            prisma.field.count({ where: { farmId: user.farmId, active: true } }),
            prisma.field.count({
                where: {
                    farmId: user.farmId,
                    active: true,
                    status: { in: [FIELD_STATUS.PLANTED, FIELD_STATUS.GROWING, FIELD_STATUS.HARVESTING] }
                }
            }),
            prisma.field.count({
                where: {
                    farmId: user.farmId,
                    active: true,
                    createdAt: { gte: monthStart }
                }
            }),
            prisma.field.count({
                where: {
                    farmId: user.farmId,
                    active: true,
                    createdAt: { gte: lastMonthStart, lt: monthStart }
                }
            })
        ]);

        const monthlyFieldIncrease = fieldsThisMonth - fieldsLastMonth;

        // Task statistics
        const [
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            tasksCompletedToday,
            tasksDueToday,
            pendingTasksCreatedToday,
            completedThisWeek,
            completedLastWeek
        ] = await prisma.$transaction([
            prisma.task.count({ where: taskWhereClause }),
            prisma.task.count({ where: { ...taskWhereClause, status: TASK_STATUS.COMPLETED } }),
            prisma.task.count({ where: { ...taskWhereClause, status: TASK_STATUS.IN_PROGRESS } }),
            prisma.task.count({ where: { ...taskWhereClause, status: TASK_STATUS.PENDING } }),
            prisma.task.count({
                where: {
                    ...taskWhereClause,
                    status: TASK_STATUS.COMPLETED,
                    updatedAt: { gte: todayStart, lte: todayEnd },
                },
            }),
            prisma.task.count({
                where: {
                    ...taskWhereClause,
                    dueDate: { gte: todayStart, lte: todayEnd },
                },
            }),
            prisma.task.count({
                where: {
                    ...taskWhereClause,
                    status: TASK_STATUS.PENDING,
                    createdAt: { gte: todayStart, lte: todayEnd },
                },
            }),
            prisma.task.count({
                where: {
                    ...taskWhereClause,
                    status: TASK_STATUS.COMPLETED,
                    updatedAt: { gte: weekAgo },
                },
            }),
            prisma.task.count({
                where: {
                    ...taskWhereClause,
                    status: TASK_STATUS.COMPLETED,
                    updatedAt: { gte: twoWeeksAgo, lt: weekAgo },
                },
            }),
        ]);

        // Worker statistics (only for admins)
        let totalWorkers = 0;
        let activeWorkersToday = 0;

        if (user.role === 'admin') {
            const workers = await prisma.user.findMany({
                where: {
                    farmId: user.farmId,
                    role: 'worker'
                },
                include: {
                    taskAssignments: {
                        include: {
                            task: {
                                select: {
                                    status: true,
                                    updatedAt: true
                                }
                            }
                        }
                    }
                }
            });

            totalWorkers = workers.length;

            // Workers who have tasks updated today (active today)
            activeWorkersToday = workers.filter(worker =>
                worker.taskAssignments.some(assignment =>
                    assignment.task.updatedAt >= todayStart
                )
            ).length;
        }

        // Calculate completion percentage
        const completionPercent = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        // Calculate weekly change percentage
        const weeklyChangePercent = completedLastWeek > 0
            ? Math.round(((completedThisWeek - completedLastWeek) / completedLastWeek) * 100)
            : completedThisWeek > 0 ? 100 : 0;

        return {
            fields: {
                total: totalFields,
                monthlyIncrease: monthlyFieldIncrease,
                active: activeFields
            },
            tasks: {
                total: totalTasks,
                pending: pendingTasks,
                in_progress: inProgressTasks,
                completed: completedTasks,
                doneToday: tasksCompletedToday,
                pendingIncreaseToday: pendingTasksCreatedToday
            },
            workers: {
                total: totalWorkers,
                activeToday: activeWorkersToday
            },
            progress: {
                completionPercent,
                weeklyChangePercent
            }
        };
    },

    // Get farm activity overview (active tasks and field status)
    async getFarmActivity(userId, { taskLimit = 5, fieldLimit = 4 }) {
        const user = await this.getUserInfoOrFail(userId);

        // Build base where clause for tasks
        const taskWhereClause = {
            farmId: user.farmId,
            status: {
                in: [TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS]
            }
        };

        // If worker, only show their assigned tasks
        if (user.role === 'worker') {
            taskWhereClause.taskAssignments = {
                some: { workerId: userId }
            };
        }

        const [activeTasks, fieldStatus] = await prisma.$transaction([
            // Get active tasks
            prisma.task.findMany({
                where: taskWhereClause,
                take: taskLimit,
                orderBy: [
                    { priority: 'desc' },
                    { dueDate: 'asc' }
                ],
                include: {
                    field: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    taskAssignments: {
                        include: {
                            worker: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            }),
            // Get field status (only for admins)
            user.role === 'admin' ? prisma.field.findMany({
                where: {
                    farmId: user.farmId,
                    active: true,
                    status: {
                        in: [FIELD_STATUS.PLANTED, FIELD_STATUS.GROWING, FIELD_STATUS.HARVESTING]
                    }
                },
                take: fieldLimit,
                orderBy: [
                    { status: 'desc' },
                    { updatedAt: 'desc' }
                ],
                include: {
                    tasks: {
                        where: {
                            status: {
                                in: [TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS]
                            }
                        },
                        include: {
                            taskAssignments: {
                                select: {
                                    workerId: true
                                }
                            }
                        }
                    }
                }
            }) : Promise.resolve([])
        ]);

        // Transform active tasks
        const transformedTasks = activeTasks.map(task => {
            const assignedWorkers = task.taskAssignments.map(assignment => {
                const nameParts = assignment.worker.name.trim().split(' ');
                const initials = nameParts.length >= 2
                    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                    : nameParts[0].substring(0, 2).toUpperCase();

                return {
                    id: assignment.worker.id,
                    name: assignment.worker.name,
                    initials
                };
            });

            // Calculate progress percent based on status
            const progressPercent = task.status === TASK_STATUS.IN_PROGRESS ? 60 : 0;

            return {
                id: task.id,
                title: task.title,
                fieldId: task.fieldId,
                fieldName: task.field?.name || null,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                assignedWorkers,
                progressPercent
            };
        });

        // Transform field status
        const transformedFields = fieldStatus.map(field => {
            const activeTasks = field.tasks.length;

            // Get unique workers across all tasks
            const uniqueWorkerIds = new Set();
            field.tasks.forEach(task => {
                task.taskAssignments.forEach(assignment => {
                    uniqueWorkerIds.add(assignment.workerId);
                });
            });

            // Calculate progress (completed tasks / total tasks for this field)
            const allFieldTasks = field.tasks.length;
            const completedFieldTasks = field.tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
            const progressPercent = allFieldTasks > 0
                ? Math.round((completedFieldTasks / allFieldTasks) * 100)
                : 0;

            return {
                id: field.id,
                name: field.name,
                size: field.size,
                cropType: field.cropType,
                status: field.status,
                activeTasks,
                workersCount: uniqueWorkerIds.size,
                progressPercent
            };
        });

        return {
            activeTasks: transformedTasks,
            fieldStatus: transformedFields
        };
    },

    // Get recent activity feed
    async getRecentActivity(userId, { limit = 10 }) {
        const user = await this.getUserInfoOrFail(userId);

        const activities = await prisma.activity.findMany({
            where: {
                metadata: {
                    path: ['farmId'],
                    equals: user.farmId
                }
            },
            take: limit,
            orderBy: {
                timestamp: 'desc'
            }
        });

        return {
            activities: activities.map(activity => ({
                id: activity.id,
                type: activity.type,
                title: activity.title,
                message: activity.message,
                timestamp: activity.timestamp,
                metadata: activity.metadata
            }))
        };
    },

    // Get recent tasks
    async getRecentTasks(userId, { limit = 5 }) {
        const user = await this.getUserInfoOrFail(userId);

        // Build base where clause
        const whereClause = {
            farmId: user.farmId
        };

        // If worker, only show their assigned tasks
        if (user.role === 'worker') {
            whereClause.taskAssignments = {
                some: { workerId: userId }
            };
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            take: limit,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                field: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                taskAssignments: {
                    include: {
                        worker: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return {
            tasks: tasks.map(task => ({
                id: task.id,
                title: task.title,
                status: task.status,
                priority: task.priority,
                fieldId: task.fieldId,
                fieldName: task.field?.name || null,
                assignedWorkers: task.taskAssignments.map(assignment => ({
                    id: assignment.worker.id,
                    name: assignment.worker.name
                })),
                dueDate: task.dueDate,
                completedAt: task.status === TASK_STATUS.COMPLETED ? task.updatedAt : null
            }))
        };
    },

    // Get today's overview (weather and field statistics)
    async getTodayOverview(userId) {
        const user = await this.getUserInfoOrFail(userId);

        // --- 1. GET FIELD STATISTICS ---
        const [totalFields, activeFields] = await prisma.$transaction([
            prisma.field.count({
                where: {
                    farmId: user.farmId,
                    active: true
                }
            }),
            prisma.field.count({
                where: {
                    farmId: user.farmId,
                    active: true,
                    status: {
                        in: [FIELD_STATUS.PLANTED, FIELD_STATUS.GROWING, FIELD_STATUS.HARVESTING]
                    }
                }
            })
        ]);

        // Calculate total area
        const fields = await prisma.field.findMany({
            where: {
                farmId: user.farmId,
                active: true
            },
            select: {
                size: true,
                status: true
            }
        });

        const totalArea = fields.reduce((sum, field) => sum + field.size, 0);
        const underCultivationArea = fields
            .filter(field => [FIELD_STATUS.PLANTED, FIELD_STATUS.GROWING, FIELD_STATUS.HARVESTING].includes(field.status))
            .reduce((sum, field) => sum + field.size, 0);

        // --- 2. GET WEATHER DATA ---
        const weatherData = await this.getWeatherForFarm(user.farmId);

        // --- 3. RETURN COMBINED DATA ---
        return {
            weather: weatherData,
            fields: {
                total: totalFields,
                activeFields: activeFields,
                totalArea: parseFloat(totalArea.toFixed(2)),
                underCultivationArea: parseFloat(underCultivationArea.toFixed(2))
            }
        };
    },

    // Get worker dashboard overview
    async getWorkerDashboard(userId) {
        const user = await this.getUserInfoOrFail(userId);

        // Build base where clause - workers only see their assigned tasks
        const baseWhereClause = {
            farmId: user.farmId
        };

        if (user.role === 'worker') {
            baseWhereClause.taskAssignments = {
                some: { workerId: userId }
            };
        }

        // Get today's date range
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        const [
            pendingTasks,
            inProgressTasks,
            completedTodayTasks,
            todayTasks,
            upcomingTasks
        ] = await prisma.$transaction([
            // Pending tasks count
            prisma.task.count({
                where: {
                    ...baseWhereClause,
                    status: TASK_STATUS.PENDING
                }
            }),
            // In progress tasks count
            prisma.task.count({
                where: {
                    ...baseWhereClause,
                    status: TASK_STATUS.IN_PROGRESS
                }
            }),
            // Completed today tasks count
            prisma.task.count({
                where: {
                    ...baseWhereClause,
                    status: TASK_STATUS.COMPLETED,
                    updatedAt: {
                        gte: todayStart,
                        lte: todayEnd
                    }
                }
            }),
            // Today's tasks
            prisma.task.findMany({
                where: {
                    ...baseWhereClause,
                    dueDate: {
                        gte: todayStart,
                        lte: todayEnd
                    },
                    status: {
                        in: [TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS]
                    }
                },
                orderBy: [
                    { priority: 'desc' },
                    { dueDate: 'asc' }
                ],
                include: {
                    field: {
                        select: {
                            name: true
                        }
                    }
                }
            }),
            // Upcoming tasks (tomorrow and beyond)
            prisma.task.findMany({
                where: {
                    ...baseWhereClause,
                    dueDate: {
                        gt: todayEnd,
                        lte: tomorrow
                    },
                    status: {
                        in: [TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS]
                    }
                },
                take: 5,
                orderBy: [
                    { priority: 'desc' },
                    { dueDate: 'asc' }
                ],
                include: {
                    field: {
                        select: {
                            name: true
                        }
                    }
                }
            })
        ]);

        // Get weather data
        const weatherData = await this.getWeatherForFarm(user.farmId);

        return {
            taskStatistics: {
                pending: {
                    count: pendingTasks,
                    label: 'Start soon'
                },
                inProgress: {
                    count: inProgressTasks,
                    label: 'Finish today'
                },
                completed: {
                    count: completedTodayTasks,
                    label: "Today's Tasks"
                }
            },
            todayTasks: todayTasks.map(task => ({
                id: task.id,
                title: task.title,
                status: task.status.toUpperCase(),
                priority: task.priority.toUpperCase(),
                dueTime: task.dueDate,
                fieldName: task.field?.name || null
            })),
            upcomingTasks: upcomingTasks.map(task => ({
                id: task.id,
                title: task.title,
                status: task.status.toUpperCase(),
                priority: task.priority.toUpperCase(),
                dueDate: task.dueDate,
                fieldName: task.field?.name || null
            })),
            weather: {
                temperature: weatherData.temperature,
                condition: weatherData.condition,
                humidity: weatherData.humidity,
                windSpeed: weatherData.windSpeedKmh,
                icon: weatherData.icon
            }
        };
    }
};

module.exports = dashboardService;