const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
const prisma = new PrismaClient();

const formatEvent = (
  type,
  date,
  title,
  description,
  author,
  metadata = {}
) => ({
  type, // 'status', 'task', 'update', 'create'
  date,
  title,
  description,
  author,
  metadata,
});

const calculateProgress = (field) => {
  const totalTasks = field.tasks ? field.tasks.length : 0;
  const doneTasks = field.tasks
    ? field.tasks.filter((t) => t.status === "completed").length
    : 0;
  return totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
};

// GET /fields (List with Progress)
exports.listFields = async (req, res) => {
  try {
    const { farmId } = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const activeFilter = req.query.history === "true" ? false : true;

    const fields = await prisma.field.findMany({
      where: {
        farmId: farmId,
        active: activeFilter,
      },
      skip: skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        tasks: true,
      },
    });

    const total = await prisma.field.count({
      where: { farmId: farmId, active: activeFilter },
    });

    // map over fields and add progress
    const fieldsWithProgress = fields.map((field) => {
      const progress = calculateProgress(field);
      const { tasks, ...fieldData } = field;
      return { ...fieldData, progress };
    });

    res.json({
      data: fieldsWithProgress,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch fields" });
  }
};

// POST /fields (Create new field)
exports.createField = async (req, res) => {
  try {
    const { name, size, cropType } = req.body;
    const { farmId } = req.user;

    const newField = await prisma.field.create({
      data: {
        name,
        size,
        cropType,
        farmId,
        status: "planted",
        plantedDate: new Date(),
        active: true,
      },
    });

    res.json({ ...newField, progress: 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to create field" });
  }
};

// PUT /fields/:id (Versioning logic)
exports.updateField = async (req, res) => {
  const { id } = req.params;
  const { name, size, cropType, status } = req.body;
  const { farmId } = req.user;

  try {
    const currentField = await prisma.field.findUnique({
      where: { id: parseInt(id) },
    });

    if (!currentField || currentField.farmId !== farmId) {
      return res.status(404).json({ error: "Field not found" });
    }

    const isNewSeason = cropType && cropType !== currentField.cropType;

    if (isNewSeason) {
      const result = await prisma.$transaction(async (tx) => {
        // Archive old
        await tx.field.update({
          where: { id: parseInt(id) },
          data: {
            active: false,
            harvestDate: new Date(),
            status: "harvesting",
          },
        });

        // Create new
        return await tx.field.create({
          data: {
            name: name || currentField.name,
            size: size || currentField.size,
            farmId,
            cropType,
            status: status || "planted",
            plantedDate: new Date(),
            active: true,
          },
        });
      });

      // New version has 0 tasks -> 0 Progress
      return res.json({
        message: "Field versioned",
        field: { ...result, progress: 0 },
      });
    }

    const updatedField = await prisma.field.update({
      where: { id: parseInt(id) },
      data: { name, size, status },
      include: { tasks: true },
    });

    const progress = calculateProgress(updatedField);
    const { tasks, ...fieldData } = updatedField;

    res.json({
      message: "Field updated",
      field: { ...fieldData, progress },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update field" });
  }
};

// DELETE /fields/:id
exports.deleteField = async (req, res) => {
  const { id } = req.params;
  const { farmId } = req.user;

  try {
    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) },
    });
    if (!field || field.farmId !== farmId) {
      return res.status(404).json({ error: "Field not found" });
    }

    await prisma.field.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });

    res.json({ message: "Field removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete field" });
  }
};

// Search fields by name
exports.searchField = async (req, res) => {
  const { fieldname } = req.query;
  const { farmId } = req.user;

  if (!fieldname) {
    return res.status(400).json({ error: "Please provide a fieldName" });
  }
  try {
    const fields = await prisma.field.findMany({
      where: {
        farmId: farmId,
        name: {
          contains: fieldname,
          mode: "insensitive",
        },
        active: true,
      },
      include: { tasks: true },
    });

    const fieldsCount = fields.length;
    if (fieldsCount === 0) {
      return res.status(404).json({ message: "no fields found" });
    }

    const fieldsWithProgress = fields.map((field) => {
      const progress = calculateProgress(field);
      const { tasks, ...fieldData } = field;
      return { ...fieldData, progress };
    });

    res.json({
      message: `${fieldsCount} fields found`,
      fields: fieldsWithProgress,
    });
  } catch (error) {
    res.status(500).json({ error: "failed to search fields" });
  }
};

// Filter fields by status
exports.filterField = async (req, res) => {
  const { status } = req.query;
  const { farmId } = req.user;

  try {
    const filteredFields = await prisma.field.findMany({
      where: {
        farmId: farmId,
        status: status,
        active: true, // Ensure we only filter active fields
      },
      include: { tasks: true },
    });

    const fieldsCount = filteredFields.length;
    if (fieldsCount === 0) {
      return res.status(404).json({ message: "no fields found" });
    }

    const fieldsWithProgress = filteredFields.map((field) => {
      const progress = calculateProgress(field);
      const { tasks, ...fieldData } = field;
      return { ...fieldData, progress };
    });

    res.json({
      message: `${fieldsCount} fields found`,
      filteredFields: fieldsWithProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to filter fields" });
  }
};

// Get field details
exports.getFieldDetails = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { farmId } = req.user;

    const fieldData = await prisma.field.findFirst({
      where: {
        id: parseInt(fieldId),
        farmId: farmId,
      },
      include: {
        tasks: {
          orderBy: { dueDate: "asc" },
          include: {
            taskAssignments: {
              include: {
                worker: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!fieldData) {
      return res.status(404).json({ error: "Field not found" });
    }

    const workerMap = new Map();

    fieldData.tasks.forEach((task) => {
      task.taskAssignments.forEach((assignment) => {
        if (assignment.worker && !workerMap.has(assignment.worker.id)) {
          workerMap.set(assignment.worker.id, assignment.worker);
        }
      });
    });

    const uniqueWorkers = Array.from(workerMap.values());

    const cleanedTasks = fieldData.tasks.map((task) => {
      const { taskAssignments, ...taskDetails } = task;
      return taskDetails;
    });

    const totalTasks = cleanedTasks.length;
    const doneTasks = cleanedTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const progress =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    const response = {
      ...fieldData,
      tasks: cleanedTasks,
      workers: uniqueWorkers,
      progress,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching field details:", error);
    return res.status(500).json({ error: "Failed to fetch field details" });
  }
};
exports.getWorkerFields = async (req, res) => {
  const workerId = req.user.id;
  const { farmId } = req.user;
  try {
    const fields = await prisma.field.findMany({
      where: {
        farmId,
        active: true,
        tasks: {
          some: {
            taskAssignments: {
              some: { workerId },
            },
          },
        },
      },
      include: { tasks: true },
    });

    const fieldsWithProgress = fields.map((field) => {
      const progress = calculateProgress(field);
      const { tasks, ...fieldData } = field;
      return { ...fieldData, progress };
    });

    res.json(fieldsWithProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch worker fields" });
  }
};

exports.getWorkerFieldDetails = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const workerId = req.user.id;

    const field = await prisma.field.findFirst({
      where: {
        id: parseInt(fieldId),
        tasks: {
          some: {
            taskAssignments: {
              some: { workerId: workerId },
            },
          },
        },
      },
      include: {
        tasks: {
          where: {
            taskAssignments: {
              some: { workerId: workerId },
            },
          },
          include: {
            taskAssignments: true,
          },
        },
      },
    });

    if (!field) {
      return res
        .status(404)
        .json({ error: "Field not found or not assigned to you" });
    }

    const progress = calculateProgress(field);

    res.json({ ...field, progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch field details" });
  }
};

// GET /fields/:id/history //the full screen(details)
exports.getFieldHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { filter } = req.query; // 'all', 'tasks', 'updates','status'
    const farmId = req.user.farmId;

    const currentField = await prisma.field.findUnique({
      where: { id: parseInt(id) },
    });

    if (!currentField || currentField.farmId !== farmId) {
      return res.status(404).json({ error: "Field not found" });
    }

    let historyStream = [];

    //Previous Crop Cyclest
    if (filter === "all" || filter === "status") {
      const pastVersions = await prisma.field.findMany({
        where: {
          farmId: farmId,
          name: currentField.name,
          active: false, //only the historical fields
        },
        orderBy: { createdAt: "desc" },
      });

      const versionEvents = pastVersions.map((v) =>
        formatEvent(
          "status",
          v.createdAt, // Or harvestDate
          `Status changed to ${v.status}`,
          `Crop cycle: ${v.cropType || "None"}. Size: ${v.size}ha`,
          "System"
        )
      );
      historyStream = [...historyStream, ...versionEvents];
    }

    if (filter === "all" || filter === "tasks") {
      const fieldTasks = await prisma.task.findMany({
        where: {
          fieldId: parseInt(id),
          status: { in: ["completed", "in_progress"] },
        },
        include: {
          taskAssignments: { include: { worker: true } },
        },
        orderBy: { updatedAt: "desc" },
      });

      const taskEvents = fieldTasks.map((t) => {
        // to get worker names
        const workers = t.taskAssignments
          .map((ta) => ta.worker.name)
          .join(", ");
        return formatEvent(
          "task",
          t.updatedAt,
          `${t.title} ${t.status}`,
          t.notes || "No additional notes",
          workers || "Unassigned",
          { priority: t.priority }
        );
      });
      historyStream = [...historyStream, ...taskEvents];
    }

    // Activity Log (General Updates)
    if (filter === "all" || filter === "updates") {
      historyStream.push(
        formatEvent(
          "create",
          currentField.createdAt,
          "Field Created",
          "Initial setup completed",
          "Admin"
        )
      );
    }

    // Sort combined stream by Date (Newest first)
    historyStream.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(historyStream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch field history" });
  }
};

// GET /fields/:id/history/summary (Widget - Image 1)
exports.getFieldHistorySummary = async (req, res) => {
  // Reuse the logic but limit to 3 items
  req.query.filter = "all";
  const originalJson = res.json;
  res.json = (data) => {
    res.json = originalJson;
    // Return only top 3
    return originalJson.call(res, data.slice(0, 3));
  };
  return exports.getFieldHistory(req, res);
};
