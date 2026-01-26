const fs = require("fs");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const { body, query, param, validationResult } = require("express-validator");
const multer = require("multer");
const { PrismaClient, UserRole, TaskStatus } = require("@prisma/client");
const upload = multer();
const prisma = new PrismaClient();
const router = express.Router();
const { sendError } = require("../utils/error");
const { handleValidationErrors } = require("../middleware/validation");
const {
  authenticate,
  requirePlatformAdmin,
} = require("../middleware/dashboardMiddleware");

// GET /admin/metrics
router.get("/metrics", authenticate, requirePlatformAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalFarms,
      totalUsers,
      totalTasks,
      totalFields,
      farmsToday,
      usersToday,
      tasksToday,
      fieldsToday,
    ] = await Promise.all([
      prisma.farm.count(),
      prisma.user.count(),
      prisma.task.count(),
      prisma.field.count({ where: { active: true } }),
      prisma.farm.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.task.count({ where: { createdAt: { gte: today } } }),
      prisma.field.count({
        where: { createdAt: { gte: today }, active: true },
      }),
    ]);

    res.json({
      totalFarms,
      totalUsers,
      totalTasks,
      totalFields,
      farmsToday,
      usersToday,
      tasksToday,
      fieldsToday,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
});

// GET /admin/profile
router.get("/profile", authenticate, requirePlatformAdmin, async (req, res) => {
  console.log("from the admin profile route");
  console.log(req.user);
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { userFarm: true },
    });

    if (!user) {
      return sendError(res, 404, "NOT_FOUND", "Admin profile not found");
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      bio: null, // not in schema; adjust if you add it
      avatarUrl: user.avatar ? `${user.avatar}?t=${Date.now()}` : null,
      createdAt: user.createdAt,
      farmName: user.userFarm?.name || null,
      farmLocation: user.userFarm?.location || null,
      farmId: user.farmId,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
});

// PATCH /admin/profile
router.patch(
  "/profile",
  authenticate,
  requirePlatformAdmin,
  [
    body("name").optional().isString().isLength({ min: 3, max: 255 }),
    body("phone").optional().isString().isLength({ min: 5, max: 20 }),
    body("bio").optional().isString().isLength({ max: 500 }),
    body("farmName").optional().isString().isLength({ min: 1, max: 255 }),
    body("farmLocation").optional().isString().isLength({ min: 1, max: 255 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, phone, bio, farmName, farmLocation } = req.body;

      // Update user info
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(phone !== undefined ? { phone } : {}),
        },
      });

      // Update farm info if farmId exists and farm fields are provided
      if (updated.farmId && (farmName !== undefined || farmLocation !== undefined)) {
        await prisma.farm.update({
          where: { id: updated.farmId },
          data: {
            ...(farmName !== undefined ? { name: farmName } : {}),
            ...(farmLocation !== undefined ? { location: farmLocation } : {}),
          },
        });
      }

      // Fetch updated data with farm info
      const userWithFarm = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { userFarm: true },
      });

      res.json({
        id: userWithFarm.id,
        name: userWithFarm.name,
        email: userWithFarm.email,
        role: userWithFarm.role,
        phone: userWithFarm.phone,
        bio: bio ?? null,
        avatarUrl: userWithFarm.avatar ? `${userWithFarm.avatar}?t=${Date.now()}` : null,
        createdAt: userWithFarm.createdAt,
        farmName: userWithFarm.userFarm?.name || null,
        farmLocation: userWithFarm.userFarm?.location || null,
        farmId: userWithFarm.farmId,
      });
    } catch (err) {
      console.error(err);
      if (err.code === "P2025") {
        return sendError(res, 404, "NOT_FOUND", "Admin profile not found");
      }
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

// GET /admin/users - Platform admin listing all users
router.get("/users", authenticate, requirePlatformAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { farm: true }, // adjust as needed for your schema
      orderBy: { createdAt: "desc" }
    });
    res.json({ data: users });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
});


// POST /admin/profile/avatar
router.post(
  "/profile/avatar",
  authenticate,
  requirePlatformAdmin,
  upload.single("avatar"), //upload not defined
  async (req, res) => {
    try {
      if (!req.file) {
        return sendError(res, 400, "NO_FILE", "Avatar file is required");
      }

      // Get file extension from original filename
      const ext = path.extname(req.file.originalname) || '.jpg';
      const fileName = `admin-${req.user.id}${ext}`;

      const filePath = path.join(
        __dirname,
        "../../uploads",
        fileName
      );
      fs.writeFileSync(filePath, req.file.buffer);

      const avatarUrl = `/uploads/${fileName}?t=${Date.now()}`;

      // Update database with avatar URL (without timestamp)
      await prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: `/uploads/${fileName}` },
      });

      res.json({
        avatarUrl,
        message: "Avatar uploaded successfully",
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);
module.exports = router;
