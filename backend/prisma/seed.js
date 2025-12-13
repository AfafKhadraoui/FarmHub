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

  // Clean tables (order matters due to foreign keys)
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.field.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.farm.deleteMany();

  // 1) Platform admin
  const adminPasswordHash = await bcrypt.hash("Admin123", 10);

  const platformAdmin = await prisma.user.create({
    data: {
      email: "admin@farmhub.com",
      password: adminPasswordHash,
      name: "Platform Admin",
      phone: "+1234567890",
      role: UserRole.platform_admin,
      notificationSettings: { email: true, push: true, sms: false },
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
      email: "Ahmed@greenvalley.com",
      password: farmAdminPassword,
      name: "Ahmed Hassan",
      phone: "+201234567890",
      role: UserRole.admin,
      farmId: greenValley.id,
      notificationSettings: { email: true, push: true, sms: false },
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
      notificationSettings: { email: true, push: true, sms: false },
    },
  });

  // Workers
  const workerData = [
    {
      email: "worker1@greenvalley.com",
      password: workerPassword,
      name: "Green Worker 1",
      phone: "+201000000001",
      role: UserRole.worker,
      farmId: greenValley.id,
      notificationSettings: { email: true, push: true, sms: false },
    },
    {
      email: "worker2@greenvalley.com",
      password: workerPassword,
      name: "Green Worker 2",
      phone: "+201000000002",
      role: UserRole.worker,
      farmId: greenValley.id,
      notificationSettings: { email: true, push: true, sms: false },
    },
    {
      email: "worker1@riverside.com",
      password: workerPassword,
      name: "River Worker 1",
      phone: "+201000000003",
      role: UserRole.worker,
      farmId: riverside.id,
      notificationSettings: { email: true, push: true, sms: false },
    },
  ];

  const workers = [];
  for (const w of workerData) {
    const worker = await prisma.user.create({ data: w });
    workers.push(worker);
  }

  // Re‑fetch workers grouped by farm
  const allWorkersGreen = workers.filter((w) => w.farmId === greenValley.id);
  const allWorkersRiver = workers.filter((w) => w.farmId === riverside.id);

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

  // 5) Tasks + Assignments
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

  // TaskAssignments
  if (allWorkersGreen[0]) {
    await prisma.taskAssignment.create({
      data: { taskId: irrigationTask.id, workerId: allWorkersGreen[0].id },
    });
    await prisma.taskAssignment.create({
      data: { taskId: harvestTask.id, workerId: allWorkersGreen[0].id },
    });
  }
  if (allWorkersGreen[1]) {
    await prisma.taskAssignment.create({
      data: { taskId: irrigationTask.id, workerId: allWorkersGreen[1].id },
    });
  }
  if (allWorkersRiver[0]) {
    await prisma.taskAssignment.create({
      data: { taskId: riverTask.id, workerId: allWorkersRiver[0].id },
    });
  }

  // 6) Notifications
  const baseTime = Date.now();
  const notificationsData = [
    {
      id: `notif_${baseTime}_1`,
      userId: platformAdmin.id,
      type: "farm",
      title: "New Farm Created",
      message: "Green Valley Farm has been registered by john@example.com",
      isRead: false,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: `notif_${baseTime}_2`,
      userId: platformAdmin.id,
      type: "user",
      title: "User Milestone Reached",
      message: "Platform reached 1,000 registered users! Congratulations!",
      isRead: false,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
    // Add more notifications similarly...
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }

  // 7) Activities
  await prisma.activity.create({
    data: {
      id: "act-1",
      type: "farm_created",
      title: "New Farm Created",
      message: `${greenValley.name} was created by ${greenAdmin.name}`,
      metadata: { farmId: greenValley.id, userId: greenAdmin.id },
    },
  });

  await prisma.activity.create({
    data: {
      id: "act-2",
      type: "user_registered",
      title: "New Worker Joined",
      message: `${allWorkersGreen[0]?.name} joined ${greenValley.name}`,
      metadata: { farmId: greenValley.id, userId: allWorkersGreen[0]?.id },
    },
  });

  console.log("Seeding completed successfully.");
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
