-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'worker', 'platform_admin');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('idle', 'planted', 'growing', 'harvesting');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "farms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "joinCode" VARCHAR(20) NOT NULL,
    "createdBy" VARCHAR(255),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "role" "UserRole" NOT NULL,
    "farmId" INTEGER,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "cropType" VARCHAR(100),
    "status" "FieldStatus" NOT NULL DEFAULT 'idle',
    "plantedDate" DATE,
    "harvestDate" DATE,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "farmId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "dueDate" TIMESTAMP(0) NOT NULL,
    "notes" TEXT,
    "farmId" INTEGER NOT NULL,
    "fieldId" INTEGER,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignments" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farms_joinCode_key" ON "farms"("joinCode");

-- CreateIndex
CREATE INDEX "farms_joinCode_idx" ON "farms"("joinCode");

-- CreateIndex
CREATE INDEX "farms_createdBy_idx" ON "farms"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_farmId_idx" ON "users"("farmId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "fields_farmId_idx" ON "fields"("farmId");

-- CreateIndex
CREATE INDEX "fields_active_idx" ON "fields"("active");

-- CreateIndex
CREATE INDEX "fields_status_idx" ON "fields"("status");

-- CreateIndex
CREATE INDEX "fields_farmId_active_idx" ON "fields"("farmId", "active");

-- CreateIndex
CREATE INDEX "tasks_farmId_idx" ON "tasks"("farmId");

-- CreateIndex
CREATE INDEX "tasks_fieldId_idx" ON "tasks"("fieldId");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_dueDate_idx" ON "tasks"("dueDate");

-- CreateIndex
CREATE INDEX "task_assignments_taskId_idx" ON "task_assignments"("taskId");

-- CreateIndex
CREATE INDEX "task_assignments_workerId_idx" ON "task_assignments"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignments_taskId_workerId_key" ON "task_assignments"("taskId", "workerId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
