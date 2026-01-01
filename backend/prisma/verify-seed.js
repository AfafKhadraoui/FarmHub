// Quick verification script to check if seed data exists
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function verify() {
  try {
    console.log("🔍 Checking seed data...\n");

    // Check farm admin
    const admin = await prisma.user.findUnique({
      where: { email: "admin@testfarm.local" },
      select: { id: true, email: true, name: true, role: true, password: true },
    });

    if (!admin) {
      console.log("❌ Farm admin NOT found!");
      console.log("   Run: npm run seed1\n");
      return;
    }

    console.log("✅ Farm admin found:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);

    // Test password
    const testPassword = "Admin123!";
    const match = await bcrypt.compare(testPassword, admin.password);
    
    if (match) {
      console.log("✅ Password verification: PASSED");
      console.log(`   Password: ${testPassword}`);
    } else {
      console.log("❌ Password verification: FAILED");
      console.log("   The password hash doesn't match!");
    }

    // Check workers
    const workers = await prisma.user.findMany({
      where: {
        email: { contains: "worker" },
        role: "worker",
      },
      select: { email: true, name: true },
    });

    console.log(`\n✅ Found ${workers.length} workers`);
    if (workers.length > 0) {
      console.log("   First worker:", workers[0].email);
    }

    // Check tasks
    const tasks = await prisma.task.count();
    console.log(`\n✅ Found ${tasks} tasks`);

    console.log("\n📋 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email: admin@testfarm.local");
    console.log("Password: Admin123!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();

