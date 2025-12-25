const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.listNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const whereClause = { userId: userId };
    if (req.query.unread === "true" || req.query.isRead === "false") {
      whereClause.isRead = false;
    }

    const [totalItems, items] = await prisma.$transaction([
      prisma.notification.count({ where: whereClause }),
      prisma.notification.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { timestamp: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const unreadCount = await prisma.notification.count({
      where: { userId: userId, isRead: false },
    });

    res.json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
      unreadCount,
    });
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

exports.createTestNotification = async (req, res) => {
  try {
    const userId = req.user.id;
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
