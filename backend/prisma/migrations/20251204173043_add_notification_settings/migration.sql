-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notificationSettings" JSONB DEFAULT '{"email": true, "push": true, "sms": false}';
