-- ========================================
-- Farm Management System - PostgreSQL Database
-- Updated MVP Schema v2.0
-- ========================================
-- Changes:
-- ✅ Field names KEPT (not removed)
-- ✅ Active status added for field history tracking
-- ✅ Removed notes from Farm and User tables
-- ✅ Added createdBy to Farm (track platform admin)
-- ✅ Removed createdById from Task
-- ✅ Added TaskAssignments table (multiple workers per task)
-- ========================================

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS task_assignments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS fields CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS farms CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "FieldStatus" CASCADE;
DROP TYPE IF EXISTS "TaskStatus" CASCADE;
DROP TYPE IF EXISTS "Priority" CASCADE;

-- ========================================
-- CREATE ENUMS
-- ========================================

CREATE TYPE "UserRole" AS ENUM ('admin', 'worker', 'platform_admin');
CREATE TYPE "FieldStatus" AS ENUM ('idle', 'planted', 'growing', 'harvesting');
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- ========================================
-- CREATE TABLES
-- ========================================

-- FARMS TABLE
-- Stores farm information and unique join codes
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    "joinCode" VARCHAR(20) UNIQUE NOT NULL, -- Format: "FARM-XXXXXX"
    "createdBy" VARCHAR(255), -- Email of platform admin who created farm (for tracking)
    "createdAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX idx_farms_join_code ON farms("joinCode");
CREATE INDEX idx_farms_created_by ON farms("createdBy");

COMMENT ON COLUMN farms."createdBy" IS 'Email of platform admin who created this farm. Used by developers to track farm creation.';

-- ========================================

-- USERS TABLE
-- Stores admin, worker, and platform_admin accounts
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed with bcrypt
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role "UserRole" NOT NULL,
    "farmId" INTEGER REFERENCES farms(id) ON DELETE CASCADE, -- NULL for platform_admin
    "createdAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX idx_users_farm_id ON users("farmId");
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

COMMENT ON COLUMN users.role IS 'admin = farm owner, worker = farm employee, platform_admin = developer/super admin';
COMMENT ON COLUMN users."farmId" IS 'NULL for platform_admin users who manage the platform';

-- ========================================

-- FIELDS TABLE
-- Stores farm field/plot information WITH HISTORY TRACKING
CREATE TABLE fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- e.g., "North Field", "Plot A"
    size DOUBLE PRECISION NOT NULL, -- Size in hectares or acres
    "cropType" VARCHAR(100), -- Type of crop (Wheat, Corn, etc.)
    status "FieldStatus" DEFAULT 'idle' NOT NULL,
    "plantedDate" DATE, -- When crop was planted
    "harvestDate" DATE, -- Expected harvest date
    active BOOLEAN DEFAULT TRUE NOT NULL, -- TRUE = current, FALSE = historical
    "farmId" INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX idx_fields_farm_id ON fields("farmId");
CREATE INDEX idx_fields_active ON fields(active);
CREATE INDEX idx_fields_status ON fields(status);
CREATE INDEX idx_fields_farm_active ON fields("farmId", active); -- Composite index

COMMENT ON COLUMN fields.name IS 'Human-readable field name (North Field, Plot A, etc.)';
COMMENT ON COLUMN fields.active IS 'TRUE = current record, FALSE = historical record. When updating crop, set old to FALSE and create new row.';

-- ========================================

-- TASKS TABLE
-- Stores work tasks (multiple workers via TaskAssignments table)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status "TaskStatus" DEFAULT 'pending' NOT NULL,
    priority "Priority" DEFAULT 'medium' NOT NULL,
    "dueDate" TIMESTAMP(0) NOT NULL,
    notes TEXT, -- Worker can add notes/comments
    "farmId" INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    "fieldId" INTEGER REFERENCES fields(id) ON DELETE SET NULL, -- Related field (NULL = no specific field)
    "createdAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX idx_tasks_farm_id ON tasks("farmId");
CREATE INDEX idx_tasks_field_id ON tasks("fieldId");
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks("dueDate");

COMMENT ON TABLE tasks IS 'Work tasks for farm. Multiple workers can be assigned via task_assignments table.';

-- ========================================

-- TASK_ASSIGNMENTS TABLE
-- Junction table for many-to-many relationship between tasks and workers
CREATE TABLE task_assignments (
    id SERIAL PRIMARY KEY,
    "taskId" INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    "workerId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "assignedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("taskId", "workerId") -- Prevent duplicate assignments
);

-- Create indexes
CREATE INDEX idx_task_assignments_task_id ON task_assignments("taskId");
CREATE INDEX idx_task_assignments_worker_id ON task_assignments("workerId");

COMMENT ON TABLE task_assignments IS 'Allows multiple workers per task. One task can have many assignments.';

-- ========================================
-- TRIGGER FOR UPDATED_AT
-- ========================================

-- Function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updatedAt
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA (for testing)
-- ========================================

-- Insert a sample farm (created by platform admin)
INSERT INTO farms (name, location, "joinCode", "createdBy")
VALUES 
    ('Green Valley Farm', 'Algiers, Algeria', 'FARM-ABC123', 'dev@farmhub.com');

-- Insert platform admin (for developers)
INSERT INTO users (email, password, name, role, "farmId")
VALUES 
    ('dev@farmhub.com', '$2b$10$abcdefghijklmnopqrstuv', 'Platform Admin', 'platform_admin', NULL);

-- Insert farm admin user
INSERT INTO users (email, password, name, phone, role, "farmId")
VALUES 
    ('admin@greenvalley.com', '$2b$10$abcdefghijklmnopqrstuv', 'John Farmer', '+213555123456', 'admin', 1);

-- Insert worker users
INSERT INTO users (email, password, name, phone, role, "farmId")
VALUES 
    ('ahmed@greenvalley.com', '$2b$10$abcdefghijklmnopqrstuv', 'Ahmed Mohamed', '+213555789012', 'worker', 1),
    ('sara@greenvalley.com', '$2b$10$abcdefghijklmnopqrstuv', 'Sara Ali', '+213555345678', 'worker', 1);

-- Insert sample fields (WITH NAMES and active status)
INSERT INTO fields (name, size, "cropType", status, "plantedDate", "harvestDate", active, "farmId")
VALUES 
    ('North Field', 2.5, 'Wheat', 'growing', '2025-01-15', '2025-06-20', TRUE, 1),
    ('South Plot', 1.8, 'Corn', 'planted', '2025-02-10', '2025-07-05', TRUE, 1),
    ('East Field', 3.0, 'Potatoes', 'idle', NULL, NULL, TRUE, 1);

-- Insert historical field record (example: North Field used to be Barley)
INSERT INTO fields (name, size, "cropType", status, "plantedDate", "harvestDate", active, "farmId")
VALUES 
    ('North Field', 2.5, 'Barley', 'harvesting', '2024-09-10', '2025-01-10', FALSE, 1);

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, "dueDate", "farmId", "fieldId")
VALUES 
    ('Water North Field', 'Water all sections thoroughly', 'pending', 'high', '2025-11-16 16:00:00', 1, 1),
    ('Check irrigation system', 'Inspect and test all irrigation lines', 'pending', 'medium', '2025-11-17 10:00:00', 1, 2),
    ('Fertilize East Field', 'Apply organic fertilizer', 'pending', 'low', '2025-11-20 08:00:00', 1, 3);

-- Assign workers to tasks (multiple workers per task)
INSERT INTO task_assignments ("taskId", "workerId")
VALUES 
    (1, 3), -- Ahmed assigned to task 1
    (1, 4), -- Sara also assigned to task 1 (multiple workers!)
    (2, 3), -- Ahmed assigned to task 2
    (3, 4); -- Sara assigned to task 3

-- ========================================
-- USEFUL QUERIES FOR YOUR APPLICATION
-- ========================================

-- ✅ Get ACTIVE fields only (current state)
-- SELECT * FROM fields WHERE "farmId" = ? AND active = TRUE;

-- ✅ Get field HISTORY for a specific field name
-- SELECT * FROM fields 
-- WHERE "farmId" = ? AND name = 'North Field' AND active = FALSE 
-- ORDER BY "createdAt" DESC;

-- ✅ Get all workers assigned to a task
-- SELECT u.* FROM users u
-- JOIN task_assignments ta ON u.id = ta."workerId"
-- WHERE ta."taskId" = ?;

-- ✅ Get all tasks for a specific worker
-- SELECT t.*, f.name as field_name FROM tasks t
-- JOIN task_assignments ta ON t.id = ta."taskId"
-- LEFT JOIN fields f ON t."fieldId" = f.id
-- WHERE ta."workerId" = ? AND f.active = TRUE
-- ORDER BY t."dueDate" ASC;

-- ✅ Assign multiple workers to a task
-- INSERT INTO task_assignments ("taskId", "workerId") VALUES (?, ?);

-- ✅ Update field crop (create new row, keep history)
-- Step 1: Set current record to inactive
-- UPDATE fields SET active = FALSE WHERE id = ? AND active = TRUE;
-- Step 2: Create new record with new crop
-- INSERT INTO fields (name, size, "cropType", status, "plantedDate", "harvestDate", active, "farmId")
-- VALUES ('North Field', 2.5, 'Corn', 'planted', '2025-03-01', '2025-07-15', TRUE, 1);

-- ✅ Get all farms created by a platform admin
-- SELECT * FROM farms WHERE "createdBy" = 'dev@farmhub.com';

-- ✅ Count stats for dashboard (only active fields)
-- SELECT 
--   (SELECT COUNT(*) FROM fields WHERE "farmId" = ? AND active = TRUE) as total_fields,
--   (SELECT COUNT(*) FROM users WHERE "farmId" = ? AND role = 'worker') as total_workers,
--   (SELECT COUNT(*) FROM tasks WHERE "farmId" = ?) as total_tasks,
--   (SELECT COUNT(*) FROM tasks WHERE "farmId" = ? AND status = 'pending') as pending_tasks;

-- ========================================
-- NOTES FOR DEVELOPERS
-- ========================================

-- 1. FIELD HISTORY TRACKING:
--    When user updates crop type or status:
--    - DON'T update existing row
--    - Set old row: active = FALSE
--    - INSERT new row with active = TRUE
--    - Same field name, new crop/status
--    - View history: WHERE name = 'X' AND active = FALSE
--
-- 2. MULTIPLE WORKERS PER TASK:
--    - One task can have many workers via task_assignments table
--    - To assign worker: INSERT INTO task_assignments
--    - To remove worker: DELETE FROM task_assignments
--    - Query worker's tasks: JOIN task_assignments
--
-- 3. PLATFORM ADMIN TRACKING:
--    - Farm.createdBy stores email of platform admin
--    - Used by developers to track who created farms
--    - Regular users don't see/access this
--    - Platform admins have role = 'platform_admin'
--    - Platform admins have farmId = NULL
--
-- 4. ACTIVE FIELDS ONLY:
--    - ALWAYS query with: WHERE active = TRUE
--    - Unless specifically viewing history
--    - Index on (farmId, active) speeds up queries
--
-- 5. REMOVED FIELDS:
--    - ✅ Removed notes from farms table
--    - ✅ Removed notes from users table
--    - ✅ Removed createdById from tasks table
--    - ✅ Removed assignedToId from tasks table (use task_assignments)

-- ========================================
-- END OF SCHEMA
-- ========================================
