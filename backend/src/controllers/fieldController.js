const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
const prisma = new PrismaClient();

// Helper function to calculate progress (Keeps code clean)
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
        tasks: true, // Required for calculation
      },
    });

    const total = await prisma.field.count({
      where: { farmId: farmId, active: activeFilter },
    });

    // Logic: Map over fields and add progress
    const fieldsWithProgress = fields.map((field) => {
      const progress = calculateProgress(field);
      const { tasks, ...fieldData } = field; // Remove heavy tasks array
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

    // A new field has 0 tasks, so progress is always 0
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

    // Simple update - Fetch tasks to ensure progress is returned correctly
    const updatedField = await prisma.field.update({
      where: { id: parseInt(id) },
      data: { name, size, status },
      include: { tasks: true }, // Include tasks to recalculate progress
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
      include: { tasks: true }, // ADDED: Include tasks
    });

    const fieldsCount = fields.length;
    if (fieldsCount === 0) {
      return res.status(404).json({ message: "no fields found" });
    }

    // ADDED: Progress Logic
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
      include: { tasks: true }, // ADDED: Include tasks
    });

    const fieldsCount = filteredFields.length;
    if (fieldsCount === 0) {
      return res.status(404).json({ message: "no fields found" });
    }

    // ADDED: Progress Logic
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
    const { farmId } = req.user; // Fixed typo: farmid -> farmId

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

    // Existing Progress Logic
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
