const express = require("express");
const { query } = require("express-validator");
const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const { sendError } = require("../utils/error");
const { handleValidationErrors } = require("../middleware/validation");
const {
  authenticate,
  requirePlatformAdmin,
} = require("../middleware/dashboardMiddleware");

// GET /search
router.get(
  "/",
  authenticate,
  requirePlatformAdmin,
  [
    query("q").isString().notEmpty(),
    query("type").optional().isIn(["farms", "users", "all"]),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const q = req.query.q;
      const type = req.query.type || "all";

      const result = { farms: [], users: [] };

      if (type === "farms" || type === "all") {
        const farms = await prisma.farm.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
            ],
          },
          include: {
            users: {
              where: { role: UserRole.admin },
              select: { name: true },
              take: 1,
            },
          },
          take: 20,
        });

        result.farms = farms.map((f) => ({
          id: f.id,
          name: f.name,
          location: f.location,
          owner: f.users[0]?.name ?? null,
        }));
      }

      if (type === "users" || type === "all") {
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 20,
        });

        result.users = users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        }));
      }

      res.json(result);
    } catch (err) {
      console.error(err);
      return sendError(res, 500, "INTERNAL_ERROR", "Internal Server Error");
    }
  }
);

module.exports = router;
