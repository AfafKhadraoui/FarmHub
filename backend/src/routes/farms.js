const express = require('express');
const { PrismaClient, UserRole, TaskStatus } = require('@prisma/client');
const { query, param } = require('express-validator');
const prisma = new PrismaClient();
const router = express.Router();

const { sendError } = require('../utils/error');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticate, requirePlatformAdmin } = require('../middleware/dashboardMiddleware');

// GET /admin/analytics/farm-growth
router.get(
  '/analytics/farm-growth',
  authenticate,
  requirePlatformAdmin,
  [query('months').optional().isInt({ min: 1, max: 24 }).toInt()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const months = req.query.months ? Number(req.query.months) : 6;

      const rows = await prisma.$queryRaw`
        SELECT
          TO_CHAR("createdAt", 'Mon') AS month,
          COUNT(*)::int AS farms
        FROM "farms"
        WHERE "createdAt" >= NOW() - (${months} || ' months')::interval
        GROUP BY TO_CHAR("createdAt", 'Mon'), DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt")
      `;

      res.json(rows.map((r) => ({ month: r.month, farms: r.farms })));
    } catch (err) {
      console.error('FARM GROWTH ERROR:', err);
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
  }
);

// GET /admin/farms/recent
router.get(
  '/farms/recent',
  authenticate,
  requirePlatformAdmin,
  [query('limit').optional().isInt({ min: 1, max: 100 }).toInt()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;

      const farms = await prisma.farm.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          users: {
            where: { role: UserRole.admin },
            select: { name: true, email: true },
            take: 1,
          },
          _count: {
            select: {
              users: { where: { role: UserRole.worker } },
              fields: { where: { active: true } },
            },
          },
        },
      });

      res.json(
        farms.map((f) => ({
          id: f.id,
          name: f.name,
          owner: f.users[0]?.name ?? null,
          ownerEmail: f.users[0]?.email ?? null,
          location: f.location,
          workers: f._count.users,
          fields: f._count.fields,
          createdAt: f.createdAt,
        }))
      );
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
  }
);

// GET /admin/farms
router.get(
  '/farms',
  authenticate,
  requirePlatformAdmin,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const skip = (page - 1) * limit;
      const search = req.query.search;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const [total, farms] = await Promise.all([
        prisma.farm.count({ where }),
        prisma.farm.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            users: {
              where: { role: UserRole.admin },
              select: { name: true, email: true },
              take: 1,
            },
            _count: {
              select: {
                users: { where: { role: UserRole.worker } },
                fields: { where: { active: true } },
                tasks: true,
              },
            },
          },
        }),
      ]);

      res.json({
        data: farms.map((f) => ({
          id: f.id,
          name: f.name,
          owner: f.users[0]?.name ?? null,
          email: f.users[0]?.email ?? null,
          location: f.location,
          workers: f._count.users,
          fields: f._count.fields,
          tasks: f._count.tasks,
          createdAt: f.createdAt,
          status: 'active',
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
  }
);

// GET /admin/farms/:id
router.get(
  '/farms/:id',
  authenticate,
  requirePlatformAdmin,
  [param('id').isInt().toInt()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const farmId = req.params.id;

      const farm = await prisma.farm.findUnique({
        where: { id: farmId },
        include: {
          users: {
            where: { role: { in: [UserRole.admin, UserRole.worker] } },
            select: { id: true, name: true, email: true, role: true },
          },
          fields: {
            where: { active: true },
            select: {
              id: true,
              name: true,
              size: true,
              cropType: true,
              status: true,
            },
          },
          tasks: true,
        },
      });

      if (!farm) {
        return sendError(res, 404, 'NOT_FOUND', 'Farm not found');
      }

      const owner = farm.users.find((u) => u.role === UserRole.admin) || null;
      const workers = farm.users.filter((u) => u.role === UserRole.worker);
      const activeTasks = farm.tasks.filter((t) => t.status !== TaskStatus.completed).length;
      const completedTasks = farm.tasks.filter((t) => t.status === TaskStatus.completed).length;

      res.json({
        id: farm.id,
        name: farm.name,
        location: farm.location,
        joinCode: farm.joinCode,
        createdAt: farm.createdAt,
        owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
        workers: workers.map((w) => ({
          id: w.id,
          name: w.name,
          email: w.email,
        })),
        fields: farm.fields.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          cropType: f.cropType,
          status: f.status,
        })),
        stats: {
          totalWorkers: workers.length,
          totalFields: farm.fields.length,
          activeTasks,
          completedTasks,
        },
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
  }
);

// GET /admin/users
router.get(
  '/users',
  authenticate,
  requirePlatformAdmin,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('role').optional().isIn(['admin', 'worker', 'platform_admin']),
    query('farmId').optional().isInt().toInt(),
    query('search').optional().isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const skip = (page - 1) * limit;
      const farmId = req.query.farmId ? Number(req.query.farmId) : null;
      const { role, search } = req.query;

      const where = {
        ...(role ? { role } : {}),
        ...(farmId ? { farmId } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      };

      const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            userFarm: { select: { id: true, name: true, location: true } },
          },
        }),
      ]);

      res.json({
        data: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          farm: u.userFarm?.name ?? null,
          farmId: u.userFarm?.id ?? null,
          phone: u.phone,
          createdAt: u.createdAt,
          status: 'active',
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
  }
);

// GET /admin/users/:id
router.get(
  '/users/:id',
  authenticate,
  requirePlatformAdmin,
  [param('id').isInt().toInt()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userFarm: {
            select: { id: true, name: true, location: true },
          },
          taskAssignments: {
            include: { task: true },
          },
        },
      });

      if (!user) {
        return sendError(res, 404, 'NOT_FOUND', 'User not found');
      }

      const tasksAssigned = user.taskAssignments.length;
      const tasksCompleted = user.taskAssignments.filter(
        (ta) => ta.task.status === TaskStatus.completed
      ).length;
      const fieldsManaged = 0;

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        farm: user.userFarm
          ? {
              id: user.userFarm.id,
              name: user.userFarm.name,
              location: user.userFarm.location,
            }
          : null,
        createdAt: user.createdAt,
        stats: {
          tasksAssigned,
          tasksCompleted,
          fieldsManaged,
        },
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
  }
);

// GET /admin/analytics
router.get('/analytics', authenticate, requirePlatformAdmin, async (req, res) => {
  try {
    const userGrowth = await prisma.$queryRaw`
      SELECT
        TO_CHAR("createdAt", 'Mon') AS month,
        COUNT(*)::int AS users
      FROM "users"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY
        TO_CHAR("createdAt", 'Mon'),
        DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `;

    const taskVolume = await prisma.$queryRaw`
      SELECT
        TO_CHAR("createdAt", 'Mon') AS month,
        COUNT(*)::int AS tasks
      FROM "tasks"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY
        TO_CHAR("createdAt", 'Mon'),
        DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `;

    const activeFarms = await prisma.$queryRaw`
      SELECT
        f.name AS farm,
        COUNT(t.id)::int AS tasks
      FROM "farms" f
      LEFT JOIN "tasks" t
        ON t."farmId" = f.id
        AND t.status != 'completed'
      GROUP BY f.id, f.name
      ORDER BY tasks DESC
      LIMIT 10
    `;

    const userDistribution = await prisma.$queryRaw`
      SELECT role, COUNT(*)::int AS value
      FROM "users"
      GROUP BY role
    `;

    const topLocations = await prisma.$queryRaw`
      SELECT location, COUNT(*)::int AS farms
      FROM "farms"
      GROUP BY location
      ORDER BY farms DESC
      LIMIT 10
    `;

    res.json({
      userGrowth: userGrowth.map((r) => ({
        month: r.month,
        users: r.users,
      })),
      taskVolume: taskVolume.map((r) => ({
        month: r.month,
        tasks: r.tasks,
      })),
      activeFarms: activeFarms.map((r) => ({
        farm: r.farm,
        tasks: r.tasks,
      })),
      userDistribution: userDistribution.map((r) => ({
        name:
          r.role === 'admin'
            ? 'Farm Owners'
            : r.role === 'worker'
            ? 'Workers'
            : 'Platform Admins',
        value: r.value,
      })),
      topLocations: topLocations.map((r) => ({
        location: r.location,
        farms: r.farms,
      })),
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
  }
});

module.exports = router;
