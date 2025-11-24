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
      avatarUrl: null, // not in schema; adjust if you add it
      createdAt: user.createdAt,
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
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, phone, bio } = req.body;

      // bio, avatarUrl do not exist in schema; remove or add them to User first.
     const updated = await prisma.user.update({
       where: { id: req.user.id },
       data: {
         ...(name !== undefined ? { name } : {}),
         ...(phone !== undefined ? { phone } : {}),
       },
     });

      res.json({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        bio: bio ?? null,
        avatarUrl: null,
        createdAt: updated.createdAt,
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
      const filePath = path.join(
        __dirname,
        "../../uploads",
        `admin-${req.user.id}.jpg`
      );
      fs.writeFileSync(filePath, req.file.buffer);

      const avatarUrl = `/uploads/admin-${req.user.id}.jpg`;
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
