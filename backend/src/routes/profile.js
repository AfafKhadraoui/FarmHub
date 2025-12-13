// backend/src/routes/profile.js
const express = require("express");
const { query } = require("express-validator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { authController } = require("../controllers/authController");
const { sendError } = require("../utils/error");
const { handleValidationErrors } = require("../middleware/validation");
const { authenticate } = require("../middleware/dashboardMiddleware");

router.get("/", authenticateToken, authController.GetUserProfile);
router.patch("/", authenticateToken, authController.UpdateUserProfile);

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