const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
//  FARM SETTINGS (farmer Only)

exports.getFarmSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userFarm: true },
    });

    if (!user.userFarm) {
      return res
        .status(404)
        .json({ error: "No farm associated with this account" });
    }

    const farmId = user.userFarm.id;

    const [totalFields, totalWorkers, activeTasks] = await prisma.$transaction([
      prisma.field.count({ where: { farmId } }),
      prisma.user.count({ where: { farmId, role: "worker" } }),
      prisma.task.count({
        where: {
          farmId,
          status: { not: "completed" },
        },
      }),
    ]);

    res.json({
      id: farmId,
      name: user.userFarm.name,
      location: user.userFarm.location,
      joinCode: user.userFarm.joinCode,
      createdAt: user.userFarm.createdAt,
      totalFields,
      totalWorkers,
      activeTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch farm settings" });
  }
};

exports.updateFarmSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.farmId) return res.status(400).json({ error: "No farm found" });

    await prisma.farm.update({
      where: { id: user.farmId },
      data: { name, location },
    });

    res.json({ message: "Farm information updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update farm" });
  }
};

exports.deleteFarmAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, confirmation } = req.body;

    if (confirmation !== "DELETE MY FARM") {
      return res.status(400).json({ error: "Invalid confirmation text" });
    }

    // Verify Password
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    if (user.farmId) {
      await prisma.farm.delete({ where: { id: user.farmId } });
    } else {
      await prisma.user.delete({ where: { id: userId } });
    }

    res.json({ message: "Farm account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

// NOTIFICATION PREFERENCES
exports.getNotificationPreferences = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { notificationSettings: true },
    });

    const defaults = {
      taskCompletion: true,
      taskOverdue: true,
      newWorkerJoined: true,
      dailySummaryEmail: true,
      weeklyPerformanceReport: true,
    };

    res.json(user.notificationSettings || defaults);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { notificationSettings: req.body },
    });

    res.json({ message: "Notification preferences updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
};

// GET /profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user with Farm and Task info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userFarm: {
          select: { id: true, name: true, createdBy: true },
        },
        // Get completed tasks for statistics
        taskAssignments: {
          where: {
            task: { status: "completed" },
          },
        },
      },
    });

    // 1. GENERIC PROFILE (farmer)
    if (user.role !== "worker") {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        farmId: user.farmId,
        avatar: user.avatar,
        createdAt: user.createdAt,
      });
    }

    // 2. WORKER SPECIFIC PROFILE

    // Calculate Stats
    const totalTasksCompleted = user.taskAssignments.length;
    const totalHoursWorked = totalTasksCompleted * 2; // Mock estimate (2hrs/task)
    const averageRating = 4.8; // Mock value

    // Format Assigned Farms
    const assignedFarms = user.userFarm
      ? [
          {
            id: `farm_${user.userFarm.id}`,
            name: user.userFarm.name,
            owner: user.userFarm.createdBy,
          },
        ]
      : [];

    res.json({
      id: `worker_${user.id}`,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || "/avatars/default.jpg",
      role: "WORKER",
      // Removed specialization
      joinedDate: user.createdAt,
      assignedFarms: assignedFarms,
      statistics: {
        totalTasksCompleted,
        totalHoursWorked,
        averageRating,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// PATCH /profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, avatar, name } = req.body;

    // 1. Prepare Update Data
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (name !== undefined) updateData.name = name;
    // Removed specialization check

    // 2. Update Database
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 3. Return Specific Response
    res.json({
      id: req.user.role === "worker" ? `worker_${userId}` : userId,
      message: "Profile updated successfully",
      updatedFields: Object.keys(updateData),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword, confirmationPassword } = req.body;

  try {
    if (newPassword !== confirmationPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirmation do not match" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect current password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to change password" });
  }
};
