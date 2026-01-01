// prisma/seed1.js - Comprehensive test data seed
const { PrismaClient, UserRole, TaskStatus, Priority, FieldStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive seed...");

  // Clean tables (order matters due to foreign keys)
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.field.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.farm.deleteMany();

  // 1) Platform admin
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const platformAdmin = await prisma.user.create({
    data: {
      email: "admin@farmhub.local",
      password: adminPasswordHash,
      name: "Platform Admin",
      phone: "+1234567890",
      role: UserRole.platform_admin,
    },
  });
  console.log("✅ Created platform admin");

  // 2) Create a test farm
  const testFarm = await prisma.farm.create({
    data: {
      name: "Test Farm - Comprehensive",
      location: "Algiers, Algeria",
      joinCode: "TEST-FARM1",
      createdBy: platformAdmin.email,
    },
  });
  console.log("✅ Created test farm:", testFarm.joinCode);

  // 3) Create farm admin (USE THIS TO LOGIN)
  // Password requirements: >8 chars, must have uppercase
  // Email format: lowercase, standard format
  const farmAdminPassword = await bcrypt.hash("Admin123!", 10);
  const farmAdmin = await prisma.user.create({
    data: {
      email: "admin@testfarm.local",
      password: farmAdminPassword,
      name: "Farm Admin",
      phone: "+213555123456",
      role: UserRole.admin,
      farmId: testFarm.id,
    },
  });
  console.log("✅ Created farm admin - Login with: admin@testfarm.local / Admin123!");

  // 4) Create multiple workers
  // Password requirements: >8 chars, must have uppercase
  // Email format: lowercase, standard format
  const workerPassword = await bcrypt.hash("Worker123!", 10);
  const workers = [];
  const workerNames = [
    "Ahmed Khalil",
    "Sara Mansouri",
    "Ali Benali",
    "Fatima Hassan",
    "Mohammed Amine",
    "Nour El Houda",
    "Karim Bensaid",
    "Layla Cherif",
  ];

  for (let i = 0; i < workerNames.length; i++) {
    const worker = await prisma.user.create({
      data: {
        email: `worker${i + 1}@testfarm.local`,
        password: workerPassword,
        name: workerNames[i],
        phone: `+213555${100000 + i}`,
        role: UserRole.worker,
        farmId: testFarm.id,
      },
    });
    workers.push(worker);
  }
  console.log(`✅ Created ${workers.length} workers`);

  // 5) Create fields
  const fields = [];
  const fieldData = [
    { name: "Field A - North", size: 12.5, cropType: "Wheat", status: FieldStatus.growing },
    { name: "Field B - South", size: 8.0, cropType: "Corn", status: FieldStatus.planted },
    { name: "Field C - East", size: 15.0, cropType: "Barley", status: FieldStatus.growing },
    { name: "Field D - West", size: 10.0, cropType: "Tomatoes", status: FieldStatus.idle },
    { name: "Field E - Central", size: 6.5, cropType: "Potatoes", status: FieldStatus.harvesting },
  ];

  for (const fieldInfo of fieldData) {
    const field = await prisma.field.create({
      data: {
        ...fieldInfo,
        farmId: testFarm.id,
        plantedDate: fieldInfo.status !== FieldStatus.idle ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : null,
        harvestDate: fieldInfo.status === FieldStatus.harvesting ? new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) : null,
      },
    });
    fields.push(field);
  }
  console.log(`✅ Created ${fields.length} fields`);

  // 6) Create tasks with various statuses, priorities, and dates
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const tasks = [];

  // PENDING TASKS (various dates)
  const pendingTasks = [
    { title: "Water irrigation system - Field A", description: "Check and run irrigation for 2 hours", priority: Priority.high, dueDate: new Date(today.getTime() + 2 * 60 * 60 * 1000), fieldId: fields[0].id },
    { title: "Apply fertilizer - Field B", description: "Apply organic fertilizer evenly", priority: Priority.medium, dueDate: tomorrow, fieldId: fields[1].id },
    { title: "Soil testing - Field C", description: "Test pH and nutrient levels", priority: Priority.low, dueDate: nextWeek, fieldId: fields[2].id },
    { title: "Equipment maintenance", description: "Service tractors and irrigation pumps", priority: Priority.high, dueDate: tomorrow, fieldId: null },
    { title: "Plant new seeds - Field D", description: "Plant tomato seeds in rows", priority: Priority.medium, dueDate: new Date(today.getTime() + 5 * 60 * 60 * 1000), fieldId: fields[3].id },
    { title: "Pest control - Field A", description: "Spray pesticides for aphids", priority: Priority.high, dueDate: tomorrow, fieldId: fields[0].id },
    { title: "Harvest preparation - Field E", description: "Prepare tools and containers", priority: Priority.medium, dueDate: nextWeek, fieldId: fields[4].id },
  ];

  // IN_PROGRESS TASKS (some due today, some later)
  const inProgressTasks = [
    { title: "Harvesting wheat - Field A", description: "Complete harvest of wheat crop", priority: Priority.high, dueDate: today, fieldId: fields[0].id },
    { title: "Weeding - Field B", description: "Remove weeds from corn field", priority: Priority.medium, dueDate: today, fieldId: fields[1].id },
    { title: "Pruning trees - Orchard", description: "Prune all fruit trees", priority: Priority.low, dueDate: tomorrow, fieldId: null },
    { title: "Irrigation check - Field C", description: "Inspect irrigation lines", priority: Priority.high, dueDate: tomorrow, fieldId: fields[2].id },
    { title: "Fence repair", description: "Fix broken fence sections", priority: Priority.medium, dueDate: nextWeek, fieldId: null },
  ];

  // COMPLETED TASKS (some completed today, some earlier)
  const completedTasks = [
    { title: "Water irrigation - Field A", description: "Completed irrigation cycle", priority: Priority.high, dueDate: yesterday, fieldId: fields[0].id, completedAt: new Date(today.getTime() - 2 * 60 * 60 * 1000) },
    { title: "Fertilizer application - Field B", description: "Applied fertilizer successfully", priority: Priority.medium, dueDate: yesterday, fieldId: fields[1].id, completedAt: new Date(today.getTime() - 4 * 60 * 60 * 1000) },
    { title: "Soil preparation - Field D", description: "Prepared soil for planting", priority: Priority.low, dueDate: lastWeek, fieldId: fields[3].id, completedAt: lastWeek },
    { title: "Equipment check", description: "Checked all equipment", priority: Priority.medium, dueDate: yesterday, fieldId: null, completedAt: new Date(today.getTime() - 6 * 60 * 60 * 1000) },
    { title: "Seed planting - Field C", description: "Planted barley seeds", priority: Priority.high, dueDate: lastWeek, fieldId: fields[2].id, completedAt: lastWeek },
    { title: "Water irrigation - Field E", description: "Completed irrigation", priority: Priority.medium, dueDate: yesterday, fieldId: fields[4].id, completedAt: new Date(today.getTime() - 1 * 60 * 60 * 1000) },
    { title: "Pest inspection", description: "Inspected for pests", priority: Priority.low, dueDate: lastWeek, fieldId: null, completedAt: lastWeek },
    { title: "Harvest - Field E", description: "Harvested potatoes", priority: Priority.high, dueDate: yesterday, fieldId: fields[4].id, completedAt: new Date(today.getTime() - 3 * 60 * 60 * 1000) },
  ];

  // Create pending tasks
  for (const taskData of pendingTasks) {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        status: TaskStatus.pending,
        farmId: testFarm.id,
        createdAt: new Date(today.getTime() - Math.random() * 24 * 60 * 60 * 1000), // Random time today or yesterday
      },
    });
    tasks.push(task);
  }

  // Create in-progress tasks
  for (const taskData of inProgressTasks) {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        status: TaskStatus.in_progress,
        farmId: testFarm.id,
        createdAt: new Date(today.getTime() - Math.random() * 48 * 60 * 60 * 1000),
        updatedAt: new Date(today.getTime() - Math.random() * 12 * 60 * 60 * 1000), // Updated today
      },
    });
    tasks.push(task);
  }

  // Create completed tasks
  for (const taskData of completedTasks) {
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        fieldId: taskData.fieldId,
        status: TaskStatus.completed,
        farmId: testFarm.id,
        createdAt: taskData.completedAt || lastWeek,
        updatedAt: taskData.completedAt || new Date(today.getTime() - Math.random() * 24 * 60 * 60 * 1000),
      },
    });
    tasks.push(task);
  }

  console.log(`✅ Created ${tasks.length} tasks (${pendingTasks.length} pending, ${inProgressTasks.length} in-progress, ${completedTasks.length} completed)`);

  // 7) Assign tasks to workers (mix of assignments)
  const assignments = [];
  
  // Assign some pending tasks
  assignments.push({ taskId: tasks[0].id, workerId: workers[0].id }); // High priority to worker 1
  assignments.push({ taskId: tasks[0].id, workerId: workers[1].id }); // Same task to 2 workers
  assignments.push({ taskId: tasks[1].id, workerId: workers[2].id });
  assignments.push({ taskId: tasks[3].id, workerId: workers[0].id });
  assignments.push({ taskId: tasks[4].id, workerId: workers[3].id });
  
  // Assign in-progress tasks
  assignments.push({ taskId: tasks[pendingTasks.length].id, workerId: workers[0].id }); // First in-progress
  assignments.push({ taskId: tasks[pendingTasks.length].id, workerId: workers[1].id });
  assignments.push({ taskId: tasks[pendingTasks.length + 1].id, workerId: workers[2].id });
  assignments.push({ taskId: tasks[pendingTasks.length + 2].id, workerId: workers[4].id });
  
  // Assign completed tasks (they were completed by these workers)
  assignments.push({ taskId: tasks[pendingTasks.length + inProgressTasks.length].id, workerId: workers[0].id });
  assignments.push({ taskId: tasks[pendingTasks.length + inProgressTasks.length + 1].id, workerId: workers[1].id });
  assignments.push({ taskId: tasks[pendingTasks.length + inProgressTasks.length + 2].id, workerId: workers[2].id });
  assignments.push({ taskId: tasks[pendingTasks.length + inProgressTasks.length + 3].id, workerId: workers[3].id });
  assignments.push({ taskId: tasks[pendingTasks.length + inProgressTasks.length + 4].id, workerId: workers[4].id });

  for (const assignment of assignments) {
    await prisma.taskAssignment.create({
      data: {
        taskId: assignment.taskId,
        workerId: assignment.workerId,
        assignedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created ${assignments.length} task assignments`);

  // 8) Create some activities
  const activities = [
    { type: "task_created", title: "Task Created", message: "Farm Admin created task: Water irrigation system - Field A" },
    { type: "task_completed", title: "Task Completed", message: "Ahmed Khalil completed task: Water irrigation - Field A" },
    { type: "worker_assigned", title: "Worker Assigned", message: "Sara Mansouri was assigned to task: Apply fertilizer - Field B" },
  ];

  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        id: `activity_${Date.now()}_${Math.random()}`,
        ...activity,
        timestamp: new Date(),
        metadata: { farmId: testFarm.id },
        userId: farmAdmin.id,
      },
    });
  }

  console.log(`✅ Created ${activities.length} activities`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 LOGIN CREDENTIALS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Farm Admin:");
  console.log("   Email: admin@testfarm.local");
  console.log("   Password: Admin123!");
  console.log("\n👷 Workers (use any):");
  console.log("   Email: worker1@testfarm.local (or worker2-8)");
  console.log("   Password: Worker123!");
  console.log("\n📊 Test Data Summary:");
  console.log(`   - ${workers.length} workers`);
  console.log(`   - ${fields.length} fields`);
  console.log(`   - ${tasks.length} tasks (${pendingTasks.length} pending, ${inProgressTasks.length} in-progress, ${completedTasks.length} completed)`);
  console.log(`   - ${assignments.length} task assignments`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

