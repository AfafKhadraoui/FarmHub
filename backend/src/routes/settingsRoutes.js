const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { authenticateToken } = require("../middleware/authMiddleware");

// all routes require login
router.use(authenticateToken);

// --- FARM SETTINGS (Admin Only) ---
router.get("/settings/farm", settingsController.getFarmSettings);
router.put("/settings/farm", settingsController.updateFarmSettings);
router.delete("/settings/farm", settingsController.deleteFarmAccount);

// --- NOTIFICATION PREFERENCES ---
router.get(
  "/settings/notification-preferences",
  settingsController.getNotificationPreferences
);
router.put(
  "/settings/notification-preferences",
  settingsController.updateNotificationPreferences
);
router.put("/settings/change-password", settingsController.changePassword);
router.get("/profile", settingsController.getUserProfile);
// Support both PUT (Farmer) and PATCH (Worker requirement)
router.patch("/profile", settingsController.updateUserProfile);
router.put("/profile", settingsController.updateUserProfile);

module.exports = router;
