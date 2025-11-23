const express = require("express");
const { query } = require("express-validator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const { sendError } = require("../utils/error");
const { handleValidationErrors } = require("../middleware/validation");
const { authenticate } = require("../middleware/dashboardMiddleware");

// GET /profile - returns current user's profile
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userFarm: { select: { id: true, name: true, location: true } },
      },
    });

    if (!user) {
      return sendError(res, 404, "NOT_FOUND", "User not found");
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      farm: user.userFarm
        ? {
            id: user.userFarm.id,
            name: user.userFarm.name,
            location: user.userFarm.location,
          }
        : null,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
  }
});

// GET /profile/notifications - convenience route to fetch user's notifications
router.get(
  "/notifications",
  authenticate,
  [query("unreadOnly").optional().isBoolean().toBoolean()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const unreadOnly = req.query.unreadOnly || false;

      const rows = await prisma.$queryRaw`
        SELECT id, type, title, message, "timestamp", is_read
        FROM notifications
        WHERE user_id = ${req.user.id}
        ${unreadOnly ? prisma.$queryRaw`AND is_read = FALSE` : prisma.$queryRaw``}
        ORDER BY "timestamp" DESC
      `;

      res.json(
        rows.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          isRead: n.is_read,
        }))
      );
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

module.exports = router;
