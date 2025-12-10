const { prisma } = require('../utils/prismaClient');


 // Background Notification Service
 // Runs periodic checks for notification triggers and stores them in the database

const notificationBackgroundService = {
    
    //Helper to create notification in database
     
    async createNotification(userId, type, title, message) {
        try {
            await prisma.notification.create({
                data: {
                    id: `notif_${Date.now()}_${userId}_${type}`,
                    userId,
                    type,
                    title,
                    message,
                    timestamp: new Date(),
                    isRead: false
                }
            });
            console.log(`✓ Notification created: ${type} for user ${userId}`);
        } catch (error) {
            console.error(`✗ Failed to create notification for user ${userId}:`, error.message);
        }
    },

    
    // Check for overdue tasks and notify assigned workers and farm admins
    async checkOverdueTasks() {
        console.log('Checking for overdue tasks...');
        
        try {
            const now = new Date();

            // Find all overdue tasks that are not completed
            const overdueTasks = await prisma.task.findMany({
                where: {
                    status: {
                        in: ['pending', 'in_progress']
                    },
                    dueDate: {
                        lt: now
                    }
                },
                include: {
                    taskAssignments: {
                        include: {
                            worker: {
                                select: {
                                    id: true,
                                    name: true,
                                    farmId: true
                                }
                            }
                        }
                    },
                    farm: {
                        include: {
                            users: {
                                where: {
                                    role: 'admin'
                                },
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            let notificationCount = 0;

            for (const task of overdueTasks) {
                // Calculate how many hours/days overdue
                const overdueDuration = now - new Date(task.dueDate);
                const overdueHours = Math.floor(overdueDuration / (1000 * 60 * 60));
                const overdueDays = Math.floor(overdueHours / 24);

                const overdueText = overdueDays > 0 
                    ? `${overdueDays} day${overdueDays > 1 ? 's' : ''}`
                    : `${overdueHours} hour${overdueHours > 1 ? 's' : ''}`;

                // Check if notification already sent (avoid duplicates)
                // We check for notifications created in the last 24 hours for this task
                const recentNotifications = await prisma.notification.findFirst({
                    where: {
                        type: 'taskOverdue',
                        message: {
                            contains: task.title
                        },
                        timestamp: {
                            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000)
                        }
                    }
                });

                // Skip if notification was already sent in the last 24 hours
                if (recentNotifications) {
                    continue;
                }

                // Notify assigned workers
                for (const assignment of task.taskAssignments) {
                    await this.createNotification(
                        assignment.worker.id,
                        'taskOverdue',
                        'Task Overdue',
                        `Task "${task.title}" is overdue by ${overdueText}. Please complete it as soon as possible.`
                    );
                    notificationCount++;
                }

                // Notify farm admins
                for (const admin of task.farm.users) {
                    await this.createNotification(
                        admin.id,
                        'taskOverdue',
                        'Task Overdue Alert',
                        `Task "${task.title}" is overdue by ${overdueText}. Status: ${task.status}.`
                    );
                    notificationCount++;
                }
            }

            console.log(`✓ Created ${notificationCount} overdue task notifications`);
            return { success: true, notificationCount };
        } catch (error) {
            console.error('✗ Error checking overdue tasks:', error.message);
            return { success: false, error: error.message };
        }
    },

    
     //Generate daily summary notifications for all farm admins
     // Summary includes: tasks completed today, pending tasks, overdue tasks
     
    async sendDailySummaries() {
        console.log('Generating daily summaries...');

        try {
            // Get all farms
            const farms = await prisma.farm.findMany({
                include: {
                    users: {
                        where: {
                            role: 'admin'
                        },
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            let notificationCount = 0;

            // Get today's date range
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            const now = new Date();

            for (const farm of farms) {
                // Get task statistics for this farm
                const [completedToday, pendingTasks, overdueTasks, inProgressTasks] = await Promise.all([
                    prisma.task.count({
                        where: {
                            farmId: farm.id,
                            status: 'completed',
                            updatedAt: {
                                gte: todayStart,
                                lte: todayEnd
                            }
                        }
                    }),
                    prisma.task.count({
                        where: {
                            farmId: farm.id,
                            status: 'pending'
                        }
                    }),
                    prisma.task.count({
                        where: {
                            farmId: farm.id,
                            status: {
                                in: ['pending', 'in_progress']
                            },
                            dueDate: {
                                lt: now
                            }
                        }
                    }),
                    prisma.task.count({
                        where: {
                            farmId: farm.id,
                            status: 'in_progress'
                        }
                    })
                ]);

                // Create summary message
                const summaryMessage = `Daily Summary for ${farm.name}:
• Completed Today: ${completedToday} tasks
• In Progress: ${inProgressTasks} tasks
• Pending: ${pendingTasks} tasks
• Overdue: ${overdueTasks} tasks

${overdueTasks > 0 ? 'Please address overdue tasks.' : '✓ All tasks are on track.'}`;

                // Send notification to all farm admins
                for (const admin of farm.users) {
                    await this.createNotification(
                        admin.id,
                        'dailySummaryEmail',
                        'Daily Farm Summary',
                        summaryMessage
                    );
                    notificationCount++;
                }
            }

            console.log(`✓ Created ${notificationCount} daily summary notifications`);
            return { success: true, notificationCount };
        } catch (error) {
            console.error('✗ Error generating daily summaries:', error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Run all background notification checks
     * This should be called by a cron job or scheduler
     */
    async runAllChecks() {
        console.log('Starting background notification checks...');
        const startTime = Date.now();

        const results = {
            overdueTasksCheck: await this.checkOverdueTasks(),
            timestamp: new Date().toISOString()
        };

        const duration = Date.now() - startTime;
        console.log(`✓ Background checks completed in ${duration}ms`);

        return results;
    },

    /**
     * Run daily summary generation
     * Should be scheduled once per day (e.g., 8:00 AM)
     */
    async runDailySummary() {
        console.log('Running daily summary generation...');
        const startTime = Date.now();

        const result = await this.sendDailySummaries();

        const duration = Date.now() - startTime;
        console.log(`✓ Daily summary completed in ${duration}ms`);

        return result;
    }
};

module.exports = notificationBackgroundService;

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Setup a cron job or scheduler (e.g., node-cron, node-schedule) in your main app:
 * 
 * const cron = require('node-cron');
 * const notificationBgService = require('./services/notificationBackgroundService');
 * 
 * // Check for overdue tasks every hour
 * cron.schedule('0 * * * *', async () => {
 *   await notificationBgService.runAllChecks();
 * });
 * 
 * // Send daily summaries every day at 8:00 AM
 * cron.schedule('0 8 * * *', async () => {
 *   await notificationBgService.runDailySummary();
 * });
 * 
 * 2. Or use it manually in a script:
 * 
 * const notificationBgService = require('./services/notificationBackgroundService');
 * 
 * // Run checks
 * notificationBgService.runAllChecks();
 * 
 * // Run daily summary
 * notificationBgService.runDailySummary();
 */