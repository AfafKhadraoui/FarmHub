//this file can used to fetch the activities instead of doing it with mock data 
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
// GET /admin/activities
router.get(
  "/activities",
  authenticate,
  requirePlatformAdmin,
  [query("limit").optional().isInt({ min: 1, max: 100 }).toInt()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const activities = await prisma.activity.findMany({
        orderBy: { timestamp: "desc" },
        take: limit,
      });

      res.json(
        activities.map((a) => ({
          id: a.id,
          type: a.type,
          title: a.title,
          message: a.message,
          timestamp: a.timestamp,
          metadata: a.metadata || {},
        }))
      );
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);
module.exports = router;
