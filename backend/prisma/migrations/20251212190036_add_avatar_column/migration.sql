-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" VARCHAR(255),
ALTER COLUMN "notificationSettings" SET DEFAULT '{"taskOverdue": true, "taskCompletion": true, "newWorkerJoined": true, "dailySummaryEmail": true, "weeklyPerformanceReport": true}';
