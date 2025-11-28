// backend/src/routes/profile.js

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { authController } = require("../controllers/authController");


router.get("/", authenticateToken, authController.GetUserProfile);
router.patch("/", authenticateToken, authController.UpdateUserProfile);

module.exports = router;