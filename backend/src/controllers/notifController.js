const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// to list all the notifications (when user clicks on bell icon or opens notification panel) you don't need to pass limit query here
//to list only notifications for bell icon pass limit query like ?limit=4
exports.listNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined; //for bell icon
    const showUnreadOnly = req.query.unread === "true";
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      take: limit,
      orderBy: { timestamp: "desc" },
    });
    const unreadNotifications = await prisma.notification.findMany({
      where: {
        userId: userId,
        isRead: false,
      },
      take: limit,
      orderBy: { timestamp: "desc" },
    });
    const allCount = await prisma.notification.count({
      where: { userId: userId },
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: userId, isRead: false },
    });
    if (showUnreadOnly) {
      res.json({ notifications: unreadNotifications, unreadCount, allCount });
    } else {
      res.json({
        notifications,
        unreadCount,
        allCount,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await prisma.notification.updateMany({
      where: {
        id: id,
        userId: userId,
      },
      data: { isRead: true },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ error: "Notification not found or unauthorized" });
    }

    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId: userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    console.log("Deleting notification with ID:", id);
    const result = await prisma.notification.deleteMany({
      where: {
        id: id, 
        userId: userId, 
      },
    });
    if (result.count === 0) {
      return res
        .status(404)
        .json({ error: "Notification not found or unauthorized" });
    }
    res.json({ message: "The notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "failed to delete the notification" });
  }
};
exports.deleteAllNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    await prisma.notification.deleteMany({
      where: {
        userId: userId,
      },
    });
    res.json({ message: "The notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "failed to delete the notification" });
  }
};
//this is just for testing purpose to create notification manually
exports.createTestNotification = async (req, res) => {
  try {
    const userId = req.user.id; // Creates notification for the logged-in user
    const { title, message, type } = req.body;

    const notification = await prisma.notification.create({
      data: {
        id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: userId,
        type: type || "info", 
        title: title || "Test Notification",
        message:
          message || "This is a manually created notification for testing.",
      },
    });

    res.status(201).json({ message: "Notification created", notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create test notification" });
  }
};