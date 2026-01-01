const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = "Admin1234"; // satisfies password rules

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email: "superadmin@farmhub.com",
      password: passwordHash,
      name: "Super Admin",
      phone: "+9999999999",
      role: UserRole.platform_admin,
    },
  });

  console.log("Created platform admin:");
  console.log({
    id: admin.id,
    email: admin.email,
    passwordPlain: password,
  });
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
