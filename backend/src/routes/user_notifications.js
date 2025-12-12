//this route is for notifications related to worker and farmer
const express = require("express");
const router = express.Router();
const notifController = require("../controllers/notifController");
const { route } = require("./fieldRoutes");
router.post("/createNotification", notifController.createTestNotification); //this is just for testing purpose to create notification
router.get("/", notifController.listNotifications); // GET /user_notifications you can pass limit and filter (unreadonly) for more details just see the test file
router.patch("/readAll", notifController.markAllAsRead);
router.delete("/deleteAll", notifController.deleteAllNotification);
router.patch("/:id/markAsRead", notifController.markAsRead);
router.delete("/:id", notifController.deleteNotification);
module.exports = router;
