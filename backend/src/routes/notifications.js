const express = require("express");
const { param, query } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const {
  authenticate,
  requirePlatformAdmin,
} = require("../middleware/dashboardMiddleware");
const { sendError } = require("../utils/error");
const { handleValidationErrors } = require("../middleware/validation");

router.get(
  "/notifications",
  authenticate,
  requirePlatformAdmin,
  [query("unreadOnly").optional().isBoolean().toBoolean()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const unreadOnly = req.query.unreadOnly || false;

      const notifications = await prisma.notification.findMany({
        where: {
          userId: req.user.id,
          ...(unreadOnly ? { isRead: false } : {}),
        },
        orderBy: { timestamp: "desc" },
      });

      res.json(
        notifications.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          isRead: n.isRead,
        }))
      );
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

// PATCH /admin/notifications/:id/read
router.patch(
  "/notifications/:id/read",
  authenticate,
  requirePlatformAdmin,
  [param("id").isString().notEmpty()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await prisma.notification.updateMany({
        where: { id, userId: req.user.id },
        data: { isRead: true },
      });

      if (updated.count === 0) {
        return sendError(res, 404, "NOT_FOUND", "Notification not found");
      }

      res.json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

// PATCH /admin/notifications/read-all
router.patch(
  "/notifications/read-all",
  authenticate,
  requirePlatformAdmin,
  async (req, res) => {
    try {
      const updated = await prisma.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
      });

      res.json({
        success: true,
        message: "All notifications marked as read",
        count: updated.count,
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

// DELETE /admin/notifications/all to delete all notifications
router.delete(
  "/notifications/all",
  authenticate,
  requirePlatformAdmin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const deleted = await prisma.notification.deleteMany({
        where: { userId: req.user.id },
      });

      if (deleted.count === 0) {
        return sendError(res, 404, "NOT_FOUND", "Notifications not found");
      }

      res.json({
        success: true,
        message: "All notifications deleted",
        count: deleted.count,
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

// DELETE /admin/notifications/:id
router.delete(
  "/notifications/:id",
  authenticate,
  requirePlatformAdmin,
  [param("id").isString().notEmpty()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await prisma.notification.deleteMany({
        where: { id, userId: req.user.id },
      });

      if (deleted.count === 0) {
        return sendError(res, 404, "NOT_FOUND", "Notification not found");
      }

      res.json({
        success: true,
        message: "Notification deleted",
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);
module.exports = router;
