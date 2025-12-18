# 🗄️ Database Setup Guide - Farm Management System v2.0

## 📋 Overview

**Major Updates in v2.0:**
- ✅ **Field names KEPT** - Fields have human-readable names
- ✅ **Field history tracking** - Track crop changes over time with `active` status
- ✅ **Multiple workers per task** - New `task_assignments` table
- ✅ **Platform admin tracking** - `createdBy` in farms table
- ✅ **Removed notes** from Farm and User tables
- ✅ **Removed createdById** from Tasks table

---

## 🏗️ Database Architecture

### **Tables (5 total):**
1. **farms** - Farm organizations
2. **users** - Admin, worker, and platform_admin accounts
3. **fields** - Farm fields with history tracking
4. **tasks** - Work assignments
5. **task_assignments** - Junction table (many-to-many)

### **Relationships:**
```
Farm (1) ──→ (Many) Users
Farm (1) ──→ (Many) Fields (with history)
Farm (1) ──→ (Many) Tasks
Task (Many) ←→ (Many) Workers (via task_assignments)
Task (1) ──→ (1) Field
```

---

## 📊 Table Details

### **1. FARMS Table**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| name | VARCHAR(255) | Farm name |
| location | VARCHAR(255) | Farm location |
| joinCode | VARCHAR(20) | Unique code for workers |
| **createdBy** | VARCHAR(255) | Email of platform admin (NEW!) |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**NEW: createdBy Field**
- Stores email of platform admin who created the farm
- Used by developers to track farm creation
- Regular users don't see this
- Example: `"dev@farmhub.com"`

---

### **2. USERS Table**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Hashed password |
| name | VARCHAR(255) | User's name |
| phone | VARCHAR(20) | Optional phone |
| **role** | ENUM | 'admin', 'worker', or **'platform_admin'** (NEW!) |
| farmId | INTEGER (FK) | NULL for platform_admin |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**NEW: platform_admin Role**
- For developers/super admins
- Can see all farms
- farmId is NULL
- Not tied to a specific farm

**REMOVED: notes column**

---

### **3. FIELDS Table (WITH HISTORY TRACKING!)**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| **name** | VARCHAR(255) | Field name (e.g., "North Field") |
| size | DOUBLE PRECISION | Size in hectares/acres |
| cropType | VARCHAR(100) | Type of crop |
| status | ENUM | Field status |
| plantedDate | DATE | When planted |
| harvestDate | DATE | Expected harvest |
| **active** | BOOLEAN | TRUE = current, FALSE = historical (NEW!) |
| farmId | INTEGER (FK) | References farms |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**🔥 CRITICAL: History Tracking with `active` Status**

**How it works:**
1. ✅ **Current fields:** `active = TRUE`
2. ✅ **Historical records:** `active = FALSE`
3. ✅ **When updating crop:** Don't UPDATE, create NEW row!

**Example Scenario:**

**Initial State (January):**
```sql
id: 1, name: 'North Field', cropType: 'Wheat', active: TRUE
```

**User wants to change to Corn (March):**

**❌ WRONG Way (loses history):**
```sql
UPDATE fields SET cropType = 'Corn' WHERE id = 1;
```

**✅ CORRECT Way (keeps history):**
```sql
-- Step 1: Mark old record as inactive
UPDATE fields SET active = FALSE WHERE id = 1;

-- Step 2: Create new record
INSERT INTO fields (name, size, cropType, status, plantedDate, harvestDate, active, farmId)
VALUES ('North Field', 2.5, 'Corn', 'planted', '2025-03-01', '2025-07-15', TRUE, 1);
```

**Result:**
```sql
-- Historical record
id: 1, name: 'North Field', cropType: 'Wheat', active: FALSE, createdAt: '2025-01-15'

-- Current record
id: 5, name: 'North Field', cropType: 'Corn', active: TRUE, createdAt: '2025-03-01'
```

**Query Active Fields:**
```javascript
const fields = await prisma.field.findMany({
  where: {
    farmId: farm.id,
    active: true  // Only current fields!
  }
});
```

**Query Field History:**
```javascript
const history = await prisma.field.findMany({
  where: {
    farmId: farm.id,
    name: 'North Field',
    active: false  // Historical records only
  },
  orderBy: {
    createdAt: 'desc'
  }
});
// Shows all past crops in this field
```

---

### **4. TASKS Table**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| title | VARCHAR(255) | Task title |
| description | TEXT | Task description |
| status | ENUM | pending, in_progress, completed |
| priority | ENUM | low, medium, high |
| dueDate | TIMESTAMP | When task is due |
| notes | TEXT | Worker notes |
| farmId | INTEGER (FK) | References farms |
| fieldId | INTEGER (FK) | Related field (optional) |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**REMOVED:**
- ❌ `createdById` - Not needed
- ❌ `assignedToId` - Replaced by task_assignments table

---

### **5. TASK_ASSIGNMENTS Table (NEW!)**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| taskId | INTEGER (FK) | References tasks |
| workerId | INTEGER (FK) | References users |
| assignedAt | TIMESTAMP | When assigned |

**Purpose:** Many-to-many relationship (one task can have multiple workers)

**Example:**
```sql
Task ID 1: "Water North Field"
  - Worker 3 (Ahmed) assigned
  - Worker 4 (Sara) assigned
  - Worker 5 (Ali) assigned
```

**Query all workers for a task:**
```javascript
const workers = await prisma.taskAssignment.findMany({
  where: { taskId: 1 },
  include: { worker: true }
});
```

**Query all tasks for a worker:**
```javascript
const tasks = await prisma.taskAssignment.findMany({
  where: { workerId: 3 },
  include: { task: true }
});
```

---

## 🔐 Key Features & Rules

### **1. Field History Tracking**

**Use Case:** Admin wants to see what crops were grown in "North Field" over the years

**Implementation:**
```javascript
// Backend API: Update field crop
async function updateFieldCrop(fieldId, newCropData) {
  // Step 1: Mark old record as inactive
  await prisma.field.update({
    where: { id: fieldId },
    data: { active: false }
  });
  
  // Step 2: Get old field data
  const oldField = await prisma.field.findUnique({
    where: { id: fieldId }
  });
  
  // Step 3: Create new record with new crop
  const newField = await prisma.field.create({
    data: {
      name: oldField.name,
      size: oldField.size,
      cropType: newCropData.cropType,
      status: newCropData.status,
      plantedDate: newCropData.plantedDate,
      harvestDate: newCropData.harvestDate,
      active: true,
      farmId: oldField.farmId
    }
  });
  
  return newField;
}
```

**History Page UI:**
```
Field: North Field (2.5 ha)

Current:
🌽 Corn - Planted Mar 2025, Harvest Jul 2025

History:
🌾 Wheat - Jan 2025 - Mar 2025
🌾 Barley - Sep 2024 - Jan 2025
🥔 Potatoes - Apr 2024 - Aug 2024
```

---

### **2. Multiple Workers Per Task**

**Use Case:** Task "Water North Field" needs 3 workers

**Implementation:**
```javascript
// Create task
const task = await prisma.task.create({
  data: {
    title: 'Water North Field',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2025-11-16 16:00:00'),
    farmId: farm.id,
    fieldId: field.id
  }
});

// Assign multiple workers
const workerIds = [3, 4, 5]; // Ahmed, Sara, Ali
for (const workerId of workerIds) {
  await prisma.taskAssignment.create({
    data: {
      taskId: task.id,
      workerId: workerId
    }
  });
}
```

**Query task with all assigned workers:**
```javascript
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: {
    taskAssignments: {
      include: {
        worker: true
      }
    }
  }
});

// task.taskAssignments = [
//   { worker: { id: 3, name: 'Ahmed' } },
//   { worker: { id: 4, name: 'Sara' } },
//   { worker: { id: 5, name: 'Ali' } }
// ]
```

---

### **3. Platform Admin Tracking**

**Use Case:** You (developers) want to see which admin created which farm

**Implementation:**
```javascript
// When platform admin creates a farm
const farm = await prisma.farm.create({
  data: {
    name: 'Green Valley Farm',
    location: 'Algiers, Algeria',
    joinCode: generateFarmCode(),
    createdBy: 'dev@farmhub.com' // Platform admin email
  }
});

// Query all farms created by a platform admin
const farms = await prisma.farm.findMany({
  where: {
    createdBy: 'dev@farmhub.com'
  }
});
```

---

## 🚀 Setup Instructions

### **Using Prisma (Recommended)**

```bash
# 1. Copy schema
cp prisma-schema.prisma backend/prisma/schema.prisma

# 2. Install dependencies
cd backend
npm install prisma @prisma/client

# 3. Set database URL
echo "DATABASE_URL='postgresql://user:pass@host:5432/db'" > .env

# 4. Generate Prisma client
npx prisma generate

# 5. Run migration
npx prisma migrate dev --name init

# 6. View database
npx prisma studio
```

---

## 📝 Common Queries

### **Get Active Fields Only**
```javascript
const fields = await prisma.field.findMany({
  where: {
    farmId: farm.id,
    active: true  // ⚠️ CRITICAL: Always filter by active!
  }
});
```

### **Get Field History**
```javascript
const history = await prisma.field.findMany({
  where: {
    farmId: farm.id,
    name: 'North Field',
    active: false
  },
  orderBy: { createdAt: 'desc' }
});
```

### **Update Field Crop (With History)**
```javascript
// Helper function
async function updateFieldCrop(fieldId, newCropData) {
  return await prisma.$transaction(async (tx) => {
    // Mark old as inactive
    await tx.field.update({
      where: { id: fieldId },
      data: { active: false }
    });
    
    // Get old field
    const oldField = await tx.field.findUnique({
      where: { id: fieldId }
    });
    
    // Create new
    return await tx.field.create({
      data: {
        ...oldField,
        ...newCropData,
        active: true,
        id: undefined, // Remove old ID
        createdAt: undefined,
        updatedAt: undefined
      }
    });
  });
}
```

### **Assign Multiple Workers to Task**
```javascript
async function assignWorkersToTask(taskId, workerIds) {
  const assignments = workerIds.map(workerId => ({
    taskId,
    workerId
  }));
  
  await prisma.taskAssignment.createMany({
    data: assignments,
    skipDuplicates: true  // Prevent duplicate assignments
  });
}
```

### **Get Worker's Tasks**
```javascript
const tasks = await prisma.task.findMany({
  where: {
    taskAssignments: {
      some: {
        workerId: currentUser.id
      }
    }
  },
  include: {
    field: {
      where: { active: true }  // Only active fields
    },
    taskAssignments: {
      include: { worker: true }
    }
  }
});
```

### **Get All Workers Assigned to Task**
```javascript
const assignments = await prisma.taskAssignment.findMany({
  where: { taskId: task.id },
  include: {
    worker: {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
});
```

### **Dashboard Stats (Only Active Fields)**
```javascript
const stats = await prisma.$transaction([
  // Total active fields
  prisma.field.count({
    where: { farmId, active: true }
  }),
  
  // Total workers
  prisma.user.count({
    where: { farmId, role: 'worker' }
  }),
  
  // Total tasks
  prisma.task.count({
    where: { farmId }
  }),
  
  // Pending tasks
  prisma.task.count({
    where: { farmId, status: 'pending' }
  })
]);
```

---

## 🎯 Important Notes

### **⚠️ ALWAYS Query Active Fields**
```javascript
// ❌ WRONG - Returns inactive/historical fields too
const fields = await prisma.field.findMany({
  where: { farmId }
});

// ✅ CORRECT - Only current fields
const fields = await prisma.field.findMany({
  where: { farmId, active: true }
});
```

### **⚠️ Don't Update Fields, Create New**
```javascript
// ❌ WRONG - Loses history
await prisma.field.update({
  where: { id },
  data: { cropType: 'Corn' }
});

// ✅ CORRECT - Preserves history
await prisma.field.update({
  where: { id },
  data: { active: false }
});
await prisma.field.create({
  data: { ...oldField, cropType: 'Corn', active: true }
});
```

### **⚠️ Use TaskAssignments for Workers**
```javascript
// ❌ OLD WAY (removed)
task.assignedToId = workerId;

// ✅ NEW WAY
await prisma.taskAssignment.create({
  data: { taskId, workerId }
});
```

---

## 📚 Database Visualization

```
┌─────────────────────────────────────────┐
│             FARMS                       │
│  (with createdBy tracking)              │
└───────────────┬─────────────────────────┘
                │
        ┌───────┼───────┬─────────┐
        │       │       │         │
        ▼       ▼       ▼         ▼
     USERS   FIELDS  TASKS   TASK_ASSIGNMENTS
              (active)        (many-to-many)
              history          ├→ TASKS
                              └→ USERS (workers)
```

---

## ✅ What's Different from v1.0

| Feature | v1.0 | v2.0 (Current) |
|---------|------|----------------|
| **Field Names** | Removed | ✅ KEPT |
| **Field History** | No tracking | ✅ Active status |
| **Workers Per Task** | One (assignedToId) | ✅ Multiple (junction table) |
| **Farm Tracking** | No | ✅ createdBy field |
| **Notes in Farm** | Yes | ❌ Removed |
| **Notes in User** | Yes | ❌ Removed |
| **Task createdById** | Yes | ❌ Removed |

---

## 🎉 Summary

**Your database now supports:**
1. ✅ Field names (North Field, South Plot, etc.)
2. ✅ Crop history tracking (see past crops)
3. ✅ Multiple workers per task (team assignments)
4. ✅ Platform admin tracking (who created which farm)
5. ✅ Cleaner schema (removed unnecessary notes)

**This is a MUCH better design!** 🚀

**Questions? Need help with:**
- Implementing field history in your API?
- Setting up multiple worker assignments?
- Querying historical data?

Let me know! 💪
