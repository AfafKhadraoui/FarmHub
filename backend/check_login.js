const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function check() {
    const email = "admin@farmhub.com"
    const password = "Admin123";

    console.log(`Checking for user: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log("User not found in database.");
    } else {
        console.log("User found.");
        console.log("Stored Password Hash:", user.password);

        // Check if it looks like a bcrypt hash (starts with $2a$ or $2b$)
        const isHash = user.password.startsWith("$2");
        console.log("Is stored password a bcrypt hash?", isHash);

        const match = await bcrypt.compare(password, user.password);
        console.log("Bcrypt Compare Result:", match);
    }

    await prisma.$disconnect();
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});
