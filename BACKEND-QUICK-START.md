# 🚀 Backend Quick Start Guide

## Overview

This guide helps you quickly implement the Fields and Notifications API endpoints.

## Prerequisites

- Node.js installed
- PostgreSQL running
- Prisma schema already set up
- JWT authentication middleware ready

## Step-by-Step Implementation

### Step 1: Install Dependencies (if needed)

```bash
cd backend
npm install express prisma @prisma/client jsonwebtoken bcrypt
npm install --save-dev @types/express @types/jsonwebtoken
```

### Step 2: Create Field Controller

Create `backend/src/controllers/field.controller.ts`:

```typescript
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fieldController = {
  // GET /api/fields
  async getAll(req: Request, res: Response) {
    try {
      const { farmId } = (req as any).user; // From JWT middleware
      const { status, cropType, search } = req.query;

      const where: any = {
        farmId,
        active: true,
      };

      if (status) where.status = status;
      if (cropType) where.cropType = cropType;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { cropType: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const fields = await prisma.field.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      // Add computed fields
      const enrichedFields = await Promise.all(
        fields.map(async (field) => {
          const activeTasks = await prisma.task.count({
            where: {
              fieldId: field.id,
              status: { not: "completed" },
            },
          });

          const assignedWorkers = await prisma.taskAssignment.groupBy({
            by: ["workerId"],
            where: {
              task: { fieldId: field.id, status: { not: "completed" } },
            },
          });

          // Calculate progress
          let progress = 0;
          if (field.plantedDate && field.harvestDate) {
            const start = new Date(field.plantedDate).getTime();
            const end = new Date(field.harvestDate).getTime();
            const now = Date.now();
            progress = Math.min(
              100,
              Math.max(0, ((now - start) / (end - start)) * 100)
            );
          }

          return {
            ...field,
            activeTasks,
            assignedWorkers: assignedWorkers.length,
            progress: Math.round(progress),
          };
        })
      );

      res.json(enrichedFields);
    } catch (error) {
      console.error("Error fetching fields:", error);
      res.status(500).json({ error: "Failed to fetch fields" });
    }
  },

  // GET /api/fields/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { farmId } = (req as any).user;

      const field = await prisma.field.findUnique({
        where: { id: Number(id) },
        include: {
          farm: { select: { id: true, name: true } },
          tasks: {
            where: { status: { not: "completed" } },
            include: {
              taskAssignments: {
                include: {
                  worker: { select: { id: true, name: true, email: true } },
                },
              },
            },
          },
        },
      });

      if (!field) {
        return res.status(404).json({ error: "Field not found" });
      }

      if (field.farmId !== farmId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(field);
    } catch (error) {
      console.error("Error fetching field:", error);
      res.status(500).json({ error: "Failed to fetch field" });
    }
  },

  // POST /api/fields
  async create(req: Request, res: Response) {
    try {
      const { role, farmId } = (req as any).user;

      if (role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { name, size, cropType, plantedDate, harvestDate } = req.body;

      const field = await prisma.field.create({
        data: {
          name,
          size,
          cropType,
          plantedDate: plantedDate ? new Date(plantedDate) : null,
          harvestDate: harvestDate ? new Date(harvestDate) : null,
          status: "idle",
          active: true,
          farmId,
        },
      });

      res.status(201).json(field);
    } catch (error) {
      console.error("Error creating field:", error);
      res.status(500).json({ error: "Failed to create field" });
    }
  },

  // PATCH /api/fields/:id
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role, farmId } = (req as any).user;

      if (role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { name, size, status, plantedDate, harvestDate } = req.body;

      // Verify field belongs to user's farm
      const existingField = await prisma.field.findUnique({
        where: { id: Number(id) },
      });

      if (!existingField || existingField.farmId !== farmId) {
        return res.status(404).json({ error: "Field not found" });
      }

      const field = await prisma.field.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name }),
          ...(size && { size }),
          ...(status && { status }),
          ...(plantedDate !== undefined && {
            plantedDate: plantedDate ? new Date(plantedDate) : null,
          }),
          ...(harvestDate !== undefined && {
            harvestDate: harvestDate ? new Date(harvestDate) : null,
          }),
        },
      });

      res.json(field);
    } catch (error) {
      console.error("Error updating field:", error);
      res.status(500).json({ error: "Failed to update field" });
    }
  },

  // PATCH /api/fields/:id/archive
  async archive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { farmId } = (req as any).user;

      const field = await prisma.field.findUnique({
        where: { id: Number(id) },
      });

      if (!field || field.farmId !== farmId) {
        return res.status(404).json({ error: "Field not found" });
      }

      await prisma.field.update({
        where: { id: Number(id) },
        data: { active: false },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error archiving field:", error);
      res.status(500).json({ error: "Failed to archive field" });
    }
  },

  // GET /api/fields/stats
  async getStats(req: Request, res: Response) {
    try {
      const { farmId } = (req as any).user;

      const [total, idle, planted, growing, harvesting] = await Promise.all([
        prisma.field.count({ where: { farmId, active: true } }),
        prisma.field.count({ where: { farmId, active: true, status: "idle" } }),
        prisma.field.count({
          where: { farmId, active: true, status: "planted" },
        }),
        prisma.field.count({
          where: { farmId, active: true, status: "growing" },
        }),
        prisma.field.count({
          where: { farmId, active: true, status: "harvesting" },
        }),
      ]);

      res.json({ total, idle, planted, growing, harvesting });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  },
};
```

### Step 3: Create Notification Controller

Create `backend/src/controllers/notification.controller.ts`:

```typescript
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const notificationController = {
  // GET /api/notifications
  async getAll(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const { isRead, type, startDate, endDate } = req.query;

      const where: any = { userId };

      if (isRead !== undefined) {
        where.isRead = isRead === "true";
      }
      if (type) where.type = type;
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = new Date(startDate as string);
        if (endDate) where.timestamp.lte = new Date(endDate as string);
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { timestamp: "desc" },
      });

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  },

  // GET /api/notifications/unread
  async getUnread(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const limit = parseInt(req.query.limit as string) || 10;

      const notifications = await prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { timestamp: "desc" },
        take: limit,
      });

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ error: "Failed to fetch unread notifications" });
    }
  },

  // GET /api/notifications/stats
  async getStats(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;

      const [total, unread] = await Promise.all([
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, isRead: false } }),
      ]);

      res.json({ total, unread });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  },

  // PATCH /api/notifications/:id/read
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = (req as any).user;

      await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error marking as read:", error);
      res.status(500).json({ error: "Failed to mark as read" });
    }
  },

  // PATCH /api/notifications/read-all
  async markAllAsRead(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error marking all as read:", error);
      res.status(500).json({ error: "Failed to mark all as read" });
    }
  },

  // DELETE /api/notifications/:id
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = (req as any).user;

      await prisma.notification.deleteMany({
        where: { id, userId },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  },
};
```

### Step 4: Create Routes

Create `backend/src/routes/field.routes.ts`:

```typescript
import { Router } from "express";
import { fieldController } from "../controllers/field.controller";
import { authMiddleware } from "../middleware/auth.middleware"; // Your existing auth

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", fieldController.getAll);
router.get("/stats", fieldController.getStats);
router.get("/:id", fieldController.getById);
router.post("/", fieldController.create);
router.patch("/:id", fieldController.update);
router.patch("/:id/archive", fieldController.archive);

export default router;
```

Create `backend/src/routes/notification.routes.ts`:

```typescript
import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", notificationController.getAll);
router.get("/unread", notificationController.getUnread);
router.get("/stats", notificationController.getStats);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.delete);

export default router;
```

### Step 5: Register Routes in Main App

Update `backend/src/app.ts` or `backend/src/index.ts`:

```typescript
import express from "express";
import cors from "cors";
import fieldRoutes from "./routes/field.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/fields", fieldRoutes);
app.use("/api/notifications", notificationRoutes);

// ... other routes

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
```

### Step 6: Test the Endpoints

```bash
# Start backend
npm run dev

# Test Fields API
curl -X GET http://localhost:5000/api/fields \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test Notifications API
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 7: Connect Frontend

The frontend is already configured! Just make sure:

1. ✅ Backend running on `http://localhost:5000`
2. ✅ JWT token stored in `localStorage` as `accessToken`
3. ✅ CORS enabled for `http://localhost:3000`

## Optional: Notification Auto-Generation

Create `backend/src/services/notification.service.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const notificationService = {
  async create(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
  }) {
    return await prisma.notification.create({
      data: {
        id: uuidv4(),
        ...data,
        isRead: false,
      },
    });
  },

  async createForFarmWorkers(
    farmId: number,
    data: {
      type: string;
      title: string;
      message: string;
    }
  ) {
    const workers = await prisma.user.findMany({
      where: { farmId, role: "worker" },
      select: { id: true },
    });

    await Promise.all(
      workers.map((worker) => this.create({ userId: worker.id, ...data }))
    );
  },
};
```

## Testing Checklist

- [ ] GET /api/fields returns all active fields
- [ ] GET /api/fields?status=growing filters correctly
- [ ] GET /api/fields/:id returns field with relations
- [ ] POST /api/fields creates new field (admin only)
- [ ] PATCH /api/fields/:id updates field
- [ ] PATCH /api/fields/:id/archive archives field
- [ ] GET /api/fields/stats returns correct counts
- [ ] GET /api/notifications returns user's notifications
- [ ] GET /api/notifications/unread returns unread only
- [ ] GET /api/notifications/stats returns correct counts
- [ ] PATCH /api/notifications/:id/read marks as read
- [ ] PATCH /api/notifications/read-all marks all as read
- [ ] DELETE /api/notifications/:id deletes notification
- [ ] Unauthorized requests return 401
- [ ] Admin-only actions check role
- [ ] farmId is enforced (users can't access other farms' data)

## Done! 🎉

Your backend is now fully integrated with the frontend. Users can:

- ✅ View and manage fields
- ✅ Receive and manage notifications
- ✅ Filter and search data
- ✅ See real-time statistics

## Troubleshooting

### Issue: CORS errors

```typescript
// In backend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### Issue: 401 Unauthorized

- Check JWT token is being sent in Authorization header
- Verify auth middleware is extracting user correctly
- Check token expiration

### Issue: 403 Forbidden

- Verify user role is correct (admin vs worker)
- Check farmId matches between user and resources

### Issue: 500 errors

- Check Prisma connection
- Verify database schema is up to date: `npx prisma migrate dev`
- Check server logs for detailed errors

## Support

See full documentation:

- `BACKEND-API-DOCS.md` - API specifications
- `IMPLEMENTATION-GUIDE.md` - Detailed guide
- `IMPLEMENTATION-SUMMARY.md` - Overview
