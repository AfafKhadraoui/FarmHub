// prisma/seed.js
const {
  PrismaClient,
  UserRole,
  TaskStatus,
  Priority,
  FieldStatus,
} = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean tables (for dev only)
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.field.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.farm.deleteMany();

  // 1) Platform admin
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  const platformAdmin = await prisma.user.create({
    data: {
      email: "admin@farmhub.com",
      password: adminPasswordHash,
      name: "Platform Admin",
      phone: "+1234567890",
      role: UserRole.platform_admin,
    },
  });
  console.log("Seeded admin:", platformAdmin);

  // 2) Farms
  const greenValley = await prisma.farm.create({
    data: {
      name: "Green Valley Farm",
      location: "Cairo, Egypt",
      joinCode: "FARM-GREEN1",
      createdBy: platformAdmin.email,
    },
  });

  const riverside = await prisma.farm.create({
    data: {
      name: "Riverside Farm",
      location: "Alexandria, Egypt",
      joinCode: "FARM-RIVER1",
      createdBy: platformAdmin.email,
    },
  });

  // 3) Farm admins and workers
  const farmAdminPassword = await bcrypt.hash("adminfarm123", 10);
  const workerPassword = await bcrypt.hash("worker123", 10);

  const greenAdmin = await prisma.user.create({
    data: {
      email: "ahmed@greenvalley.com",
      password: farmAdminPassword,
      name: "Ahmed Hassan",
      phone: "+201234567890",
      role: UserRole.admin,
      farmId: greenValley.id,
    },
  });

  const riverAdmin = await prisma.user.create({
    data: {
      email: "owner@riverside.com",
      password: farmAdminPassword,
      name: "Riverside Owner",
      phone: "+201111111111",
      role: UserRole.admin,
      farmId: riverside.id,
    },
  });

  const workersGreen = await prisma.user.createMany({
    data: [
      {
        email: "worker1@greenvalley.com",
        password: workerPassword,
        name: "Green Worker 1",
        phone: "+201000000001",
        role: UserRole.worker,
        farmId: greenValley.id,
      },
      {
        email: "worker2@greenvalley.com",
        password: workerPassword,
        name: "Green Worker 2",
        phone: "+201000000002",
        role: UserRole.worker,
        farmId: greenValley.id,
      },
    ],
  });

  const workersRiver = await prisma.user.createMany({
    data: [
      {
        email: "worker1@riverside.com",
        password: workerPassword,
        name: "River Worker 1",
        phone: "+201000000003",
        role: UserRole.worker,
        farmId: riverside.id,
      },
    ],
  });

  // Re‑fetch workers with ids
  const allWorkersGreen = await prisma.user.findMany({
    where: { farmId: greenValley.id, role: UserRole.worker },
  });
  const allWorkersRiver = await prisma.user.findMany({
    where: { farmId: riverside.id, role: UserRole.worker },
  });

  // 4) Fields
  const northField = await prisma.field.create({
    data: {
      name: "North Field",
      size: 5.5,
      cropType: "Wheat",
      status: FieldStatus.growing,
      plantedDate: new Date(),
      active: true,
      farmId: greenValley.id,
    },
  });

  const southField = await prisma.field.create({
    data: {
      name: "South Field",
      size: 3.2,
      cropType: "Corn",
      status: FieldStatus.planted,
      plantedDate: new Date(),
      active: true,
      farmId: greenValley.id,
    },
  });

  const riverField = await prisma.field.create({
    data: {
      name: "River Field",
      size: 4.0,
      cropType: "Tomatoes",
      status: FieldStatus.growing,
      plantedDate: new Date(),
      active: true,
      farmId: riverside.id,
    },
  });

  // 5) Tasks + TaskAssignments
  const irrigationTask = await prisma.task.create({
    data: {
      title: "Irrigate North Field",
      description: "Irrigate crops in North Field in the morning.",
      status: TaskStatus.in_progress,
      priority: Priority.high,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: "Check pump pressure.",
      farmId: greenValley.id,
      fieldId: northField.id,
    },
  });

  const harvestTask = await prisma.task.create({
    data: {
      title: "Harvest South Field",
      description: "Start harvesting corn.",
      status: TaskStatus.pending,
      priority: Priority.medium,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      farmId: greenValley.id,
      fieldId: southField.id,
    },
  });

  const riverTask = await prisma.task.create({
    data: {
      title: "Inspect irrigation system",
      description: "Check drip irrigation near river.",
      status: TaskStatus.completed,
      priority: Priority.low,
      dueDate: new Date(),
      farmId: riverside.id,
      fieldId: riverField.id,
    },
  });

  if (allWorkersGreen[0]) {
    await prisma.taskAssignment.create({
      data: {
        taskId: irrigationTask.id,
        workerId: allWorkersGreen[0].id,
      },
    });
    await prisma.taskAssignment.create({
      data: {
        taskId: harvestTask.id,
        workerId: allWorkersGreen[0].id,
      },
    });
  }
  if (allWorkersGreen[1]) {
    await prisma.taskAssignment.create({
      data: {
        taskId: irrigationTask.id,
        workerId: allWorkersGreen[1].id,
      },
    });
  }
  if (allWorkersRiver[0]) {
    await prisma.taskAssignment.create({
      data: {
        taskId: riverTask.id,
        workerId: allWorkersRiver[0].id,
      },
    });
  }

  // 6) Notifications for platform admin
  notifications = await prisma.notification.createMany({
    data: [
      {
        id: "notif-1",
        userId: platformAdmin.id,
        type: "farm",
        title: "New Farm Created",
        message: `A new farm '${greenValley.name}' has been registered by ${greenAdmin.email}`,
      },
      {
        id: "notif-2",
        userId: platformAdmin.id,
        type: "user",
        title: "User Milestone",
        message: "Platform reached 10 registered users!",
      },
    ],
  });
  console.log("Seeded notifications for admin:", notifications);

  // 7) Activities (global feed)
  tasks = await prisma.activity.createMany({
    data: [
      {
        id: "act-1",
        type: "farm_created",
        title: "New Farm Created",
        message: `${greenValley.name} was created by ${greenAdmin.name}`,
        metadata: {
          farmId: greenValley.id,
          userId: greenAdmin.id,
        },
      },
      {
        id: "act-2",
        type: "user_registered",
        title: "New Worker Joined",
        message: `${allWorkersGreen[0]?.name} joined ${greenValley.name}`,
        metadata: {
          farmId: greenValley.id,
          userId: allWorkersGreen[0]?.id,
        },
      },
    ],
  });

  console.log("Seeded activities for admin:", tasks);
  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
