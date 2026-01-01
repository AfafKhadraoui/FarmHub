# 🚀 Fields & Notifications Implementation Guide

## Overview

This document explains the backend-friendly implementation of Fields and Notifications for the Farm Management System.

## 🏗️ Architecture

### Frontend Structure

```
frontend/src/
├── types/
│   ├── field.types.ts           # Field TypeScript interfaces
│   └── notification.types.ts    # Notification TypeScript interfaces
├── services/
│   ├── field.service.ts         # Field API calls
│   └── notification.service.ts  # Notification API calls
├── app/(workspace)/
│   ├── fields/
│   │   └── page.tsx            # Fields list page (Worker & Farmer)
│   └── notifications/
│       └── page.tsx            # Notifications page (Backend-ready)
└── components/workspace/
    ├── NotificationsPanel.tsx  # Notifications dropdown
    └── fields/
        └── (field components)
```

### Backend Structure (To Implement)

```
backend/src/
├── controllers/
│   ├── field.controller.ts
│   └── notification.controller.ts
├── services/
│   ├── field.service.ts
│   └── notification.service.ts
├── routes/
│   ├── field.routes.ts
│   └── notification.routes.ts
└── prisma/
    └── schema.prisma          # Already defined
```

## 🎯 Features Implemented

### Fields Page

✅ **Role-based Access**

- Admin (Farmer): Full CRUD operations
- Worker: Read-only access to assigned fields

✅ **Features**

- Grid view with 3 columns
- Filter by status (all/idle/planted/growing/harvesting)
- Progress indicators
- Task and worker counts
- Responsive loading states
- Backend API integration ready

✅ **Data Flow**

```typescript
User opens page
  → useEffect loads fields via fieldService.getAll()
  → Backend filters by farmId from JWT token
  → Returns Field[] with computed properties
  → Displays in grid with real-time data
```

### Notifications Page

✅ **Features**

- Real-time notification loading from backend
- Filter tabs (All / Unread)
- Statistics card (Unread count, Total count)
- Mark as read (individual & bulk)
- Delete notifications
- Type-based color coding
- Relative timestamps
- Role-based content (Worker vs Farmer)

✅ **Data Flow**

```typescript
User opens page
  → Loads notifications via notificationService.getAll()
  → Loads stats via notificationService.getStats()
  → User marks as read → API call → Updates UI
  → User deletes → API call → Removes from list
```

## 📝 Type Definitions

### Field Types

```typescript
export interface Field {
  id: number;
  name: string;
  size: number; // hectares
  cropType: string | null;
  status: "idle" | "planted" | "growing" | "harvesting";
  plantedDate: string | null;
  harvestDate: string | null;
  active: boolean;
  farmId: number;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  progress?: number; // 0-100
  activeTasks?: number;
  assignedWorkers?: number;
}
```

### Notification Types

```typescript
export interface Notification {
  id: string; // UUID from backend
  userId: number;
  type: NotificationType; // 'task-assigned', 'weather-alert', etc.
  title: string;
  message: string;
  timestamp: string; // ISO 8601
  isRead: boolean;
  metadata?: {
    // Optional structured data
    taskId?: number;
    fieldId?: number;
    workerId?: number;
    priority?: string;
  };
}
```

## 🔌 Backend Implementation Checklist

### 1. Field Controller

```typescript
// backend/src/controllers/field.controller.ts

export class FieldController {
  // ✅ GET /api/fields - Get all active fields for user's farm
  async getAll(req, res) {
    const { farmId } = req.user; // From JWT
    const { status, cropType, search } = req.query;

    const fields = await fieldService.getAll(farmId, {
      status,
      cropType,
      search,
      active: true, // Only active fields
    });

    // Compute extra fields
    const enrichedFields = await Promise.all(
      fields.map(async (field) => ({
        ...field,
        progress: calculateProgress(field),
        activeTasks: await getActiveTaskCount(field.id),
        assignedWorkers: await getWorkerCount(field.id),
      }))
    );

    res.json(enrichedFields);
  }

  // ✅ GET /api/fields/:id - Get single field with relations
  async getById(req, res) {
    const { id } = req.params;
    const { farmId } = req.user;

    const field = await fieldService.getById(id, {
      include: {
        farm: { select: { id: true, name: true } },
        tasks: { where: { status: { not: "completed" } } },
      },
    });

    // Verify field belongs to user's farm
    if (field.farmId !== farmId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(field);
  }

  // ✅ POST /api/fields - Create new field (Admin only)
  async create(req, res) {
    const { role, farmId } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const field = await fieldService.create({
      ...req.body,
      farmId,
      active: true,
    });

    // Create notification for workers
    await notificationService.createForFarmWorkers(farmId, {
      type: "field-update",
      title: "New Field Added",
      message: `${field.name} has been added to the farm`,
      metadata: { fieldId: field.id },
    });

    res.status(201).json(field);
  }

  // ✅ PATCH /api/fields/:id - Update field
  async update(req, res) {
    const { id } = req.params;
    const { role, farmId } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const field = await fieldService.update(id, req.body, farmId);
    res.json(field);
  }

  // ✅ PATCH /api/fields/:id/archive - Archive field
  async archive(req, res) {
    const { id } = req.params;
    const { farmId } = req.user;

    await fieldService.archive(id, farmId);
    res.status(204).send();
  }

  // ✅ GET /api/fields/stats - Get statistics
  async getStats(req, res) {
    const { farmId } = req.user;
    const stats = await fieldService.getStats(farmId);
    res.json(stats);
  }
}
```

### 2. Notification Controller

```typescript
// backend/src/controllers/notification.controller.ts

export class NotificationController {
  // ✅ GET /api/notifications - Get user's notifications
  async getAll(req, res) {
    const { userId } = req.user;
    const { isRead, type, startDate, endDate } = req.query;

    const notifications = await notificationService.getAll(userId, {
      isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
      type,
      startDate,
      endDate,
    });

    res.json(notifications);
  }

  // ✅ GET /api/notifications/unread - Get unread (for dropdown)
  async getUnread(req, res) {
    const { userId } = req.user;
    const limit = parseInt(req.query.limit) || 10;

    const notifications = await notificationService.getUnread(userId, limit);
    res.json(notifications);
  }

  // ✅ GET /api/notifications/stats - Get statistics
  async getStats(req, res) {
    const { userId } = req.user;
    const stats = await notificationService.getStats(userId);
    res.json(stats);
  }

  // ✅ PATCH /api/notifications/:id/read - Mark as read
  async markAsRead(req, res) {
    const { id } = req.params;
    const { userId } = req.user;

    await notificationService.markAsRead(id, userId);
    res.status(204).send();
  }

  // ✅ PATCH /api/notifications/read-all - Mark all as read
  async markAllAsRead(req, res) {
    const { userId } = req.user;
    await notificationService.markAllAsRead(userId);
    res.status(204).send();
  }

  // ✅ DELETE /api/notifications/:id - Delete notification
  async delete(req, res) {
    const { id } = req.params;
    const { userId } = req.user;

    await notificationService.delete(id, userId);
    res.status(204).send();
  }
}
```

### 3. Notification Auto-Generation

```typescript
// backend/src/services/notification-generator.service.ts

export class NotificationGeneratorService {
  // Called when task is assigned
  async onTaskAssigned(task: Task, workerIds: number[]) {
    for (const workerId of workerIds) {
      await notificationService.create({
        userId: workerId,
        type: "task-assigned",
        title: "New Task Assigned",
        message: `You have been assigned to ${task.title}`,
        metadata: {
          taskId: task.id,
          fieldId: task.fieldId,
          priority: task.priority,
          dueDate: task.dueDate,
        },
      });
    }
  }

  // Called when task deadline approaches
  async checkTaskDeadlines() {
    const upcomingTasks = await taskService.getUpcoming(24); // 24 hours

    for (const task of upcomingTasks) {
      const workers = await task.getAssignedWorkers();

      for (const worker of workers) {
        await notificationService.create({
          userId: worker.id,
          type: "task-overdue",
          title: "Task Deadline Approaching",
          message: `${task.title} is due in ${getTimeRemaining(task.dueDate)}`,
          metadata: { taskId: task.id },
        });
      }
    }
  }

  // Called when task is completed
  async onTaskCompleted(task: Task, completedBy: number) {
    // Notify farm admin
    const admin = await userService.getFarmAdmin(task.farmId);
    await notificationService.create({
      userId: admin.id,
      type: "worker-report",
      title: "Task Completed",
      message: `${task.title} has been completed`,
      metadata: { taskId: task.id, workerId: completedBy },
    });

    // Notify assigned workers
    const workers = await task.getAssignedWorkers();
    for (const worker of workers) {
      if (worker.id !== completedBy) {
        await notificationService.create({
          userId: worker.id,
          type: "task-completed",
          title: "Task Completed",
          message: `${task.title} has been marked as completed`,
          metadata: { taskId: task.id },
        });
      }
    }
  }
}
```

## 🧪 Testing the Implementation

### 1. Test Fields API

```bash
# Get all fields
curl -X GET http://localhost:5000/api/fields \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl -X GET "http://localhost:5000/api/fields?status=growing" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create field (Admin)
curl -X POST http://localhost:5000/api/fields \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "North Field",
    "size": 15.5,
    "cropType": "Wheat",
    "plantedDate": "2025-01-15",
    "harvestDate": "2025-06-01"
  }'
```

### 2. Test Notifications API

```bash
# Get notifications
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get unread only
curl -X GET "http://localhost:5000/api/notifications?isRead=false" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark as read
curl -X PATCH http://localhost:5000/api/notifications/123/read \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get stats
curl -X GET http://localhost:5000/api/notifications/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📈 Performance Optimization

### Database Indexes

```sql
-- Already defined in Prisma schema
CREATE INDEX idx_fields_farm_active ON fields(farmId, active);
CREATE INDEX idx_notifications_user_read ON notifications(userId, isRead);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
```

### Caching Strategy

```typescript
// Use Redis for frequently accessed data
- Field counts and stats (TTL: 5 minutes)
- Unread notification counts (TTL: 1 minute)
- User permissions (TTL: 15 minutes)
```

## 🔐 Security Considerations

1. **Authorization**: Always verify `farmId` matches user's farm
2. **Role Checks**: Admin actions require `role === 'admin'`
3. **Input Validation**: Use Zod or similar for request validation
4. **Rate Limiting**: Limit notification creation to prevent spam
5. **SQL Injection**: Use Prisma's parameterized queries

## 🎨 UI/UX Features

### Fields Page

- ✅ Loading skeletons
- ✅ Empty states
- ✅ Error handling
- ✅ Responsive grid (3 → 2 → 1 columns)
- ✅ Filter persistence
- ✅ Optimistic UI updates

### Notifications Page

- ✅ Real-time updates (polling or WebSocket)
- ✅ Type-based icons and colors
- ✅ Relative timestamps
- ✅ Batch operations
- ✅ Keyboard navigation

## 🚀 Next Steps

1. **Implement Backend Controllers** (See checklists above)
2. **Set up Notification Cron Jobs** (Deadline reminders)
3. **Add WebSocket Support** (Real-time notifications)
4. **Implement Field Details Page** (View single field)
5. **Add Field Creation Modal** (Admin only)
6. **Create Notification Preferences** (User settings)

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [JWT Authentication](https://jwt.io/introduction)
- [WebSocket with Socket.io](https://socket.io/docs/v4/)
