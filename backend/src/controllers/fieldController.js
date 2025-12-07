const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
const prisma = new PrismaClient();

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
    });
    const total = await prisma.field.count({
      where: { farmId: farmId, active: activeFilter },
    });

    res.json({
      data: fields,
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

    res.json(newField);
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
    //get the current
    const currentField = await prisma.field.findUnique({
      where: { id: parseInt(id) },
    });
    console.log(currentField);

    if (!currentField || currentField.farmId !== farmId) {
      return res.status(404).json({ error: "Field not found" });
    }

    const isNewSeason = cropType && cropType !== currentField.cropType;

    if (isNewSeason) {
      const result = await prisma.$transaction(async (tx) => {
        // archive the old
        await tx.field.update({
          where: { id: parseInt(id) },
          data: {
            active: false,
            harvestDate: new Date(),
            status: "harvesting",
          },
        });

        // create new
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

      return res.json({ message: "Field versioned", field: result });
    }

    // if simple update
    const updatedField = await prisma.field.update({
      where: { id: parseInt(id) },
      data: { name, size, status },
    });

    res.json({ message: "Field updated", field: updatedField });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update field" });
  }
};

// DELETE /fields/:id (
exports.deleteField = async (req, res) => {
  const { id } = req.params;
  const { farmId } = req.user;

  try {
    // check ownership first
    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) },
    });
    if (!field || field.farmId !== farmId) {
      return res.status(404).json({ error: "Field not found" });
    }

    // SOFT DELETE: Just set active to false
    await prisma.field.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });

    res.json({ message: "Field removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete field" });
  }
};

//search fields by name
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
    });
    fieldsCount = fields.length;
    if (fieldsCount === 0) {
      return res.status(404).json({ message: "no fields found" });
    }
    res.json({ message: fieldsCount + " fields found", fields });
  } catch (error) {
    res.status(500).json({ error: "failed to search fields" });
  }
};
//filter fields by
exports.filterField = async (req, res) => {};
//to get the  field details
exports.getFieldDetails = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { farmid } = req.user;
    const fieldData = await prisma.field.findFirst({
      where: {
        id: parseInt(fieldId),
        farmId: farmid,
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

    const response = {
      ...fieldData,
      tasks: cleanedTasks,
      workers: uniqueWorkers,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching field details:", error);
    return res.status(500).json({ error: "Failed to fetch field details" });
  }
};
