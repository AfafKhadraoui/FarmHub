const { prisma } = require("../utils/prismaClient.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//to store real login activity
async function logActivity({ userId, type, message, farmId = null }) {
  try {
    await prisma.activity.create({
      data: { userId, type, message, farmId },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// generate join code
function generateFarmCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FARM-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
}

// generate token
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, farmId: user.farmId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, farmId: user.farmId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

const authService = {
  // register admin farmer
  async registerFarmer({ name, email, password, phone, farmName, location }) {
    const exists = await prisma.user.findFirst({
      where: { email },
    });
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        role: "admin",
        farmId: null,
      },
    });
    // after farm is created and user is linked
    await logActivity({
      userId: updatedUser.id,
      type: "farmer_registered",
      message: `Farmer "${updatedUser.name}" registered and created farm "${farm.name}".`,
      farmId: farm.id,
    });

    const joinCode = generateFarmCode();
    const farm = await prisma.farm.create({
      data: { name: farmName, location, joinCode, createdBy: user.email },
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { farmId: farm.id },
    });

    const { accessToken, refreshToken } = generateTokens(updatedUser);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
      user: userWithoutPassword,
      farm,
      token: accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  },

  // worker registration
  async registerWorker({ name, email, password, phone, joinCode }) {
    const farm = await prisma.farm.findUnique({ where: { joinCode } });
    if (!farm) throw new Error("Farm code not found");

    const exists = await prisma.user.findFirst({
      where: { email },
    });
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        role: "worker",
        farmId: farm.id,
      },
    });
    await logActivity({
      userId: user.id,
      type: "worker_registered",
      message: `Worker "${user.name}" joined farm "${farm.name}" using join code.`,
      farmId: farm.id,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      farm,
      token: accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  },

  // platform admin registration
  async registerAdmin({ name, email, password, phone }) {
    const exists = await prisma.user.findFirst({
      where: { email },
    });
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        role: "platform_admin",
        farmId: null,
      },
    });
    await logActivity({
      userId: user.id,
      type: "platform_admin_registered",
      message: `Platform admin "${user.name}" registered.`,
      farmId: null,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  },

  // login
  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { userFarm: true },
    });
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  },

  // get user data
  async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userFarm: true }, // <-- FIXED
    });
    if (!user) throw new Error("User not found");

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // update user profile
  async updateUserProfile(userId, { name, phone }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
    });
    await logActivity({
      userId,
      type: "profile_updated",
      message: `User "${user.name}" updated profile.`,
      farmId: user.farmId || null,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // refresh Token
  async refreshToken(refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new Error("Invalid refresh token");
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      payload.user
    );
    return {
      token: accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    };
  },

  // update join code
  async regenerateFarmJoinCode(farmId) {
    const newJoinCode = generateFarmCode();
    const farm = await prisma.farm.update({
      where: { id: farmId },
      data: { joinCode: newJoinCode },
    });
    await logActivity({
      userId: null,
      type: "farm_join_code_regenerated",
      message: `Join code regenerated for farm "${farm.name}".`,
      farmId: farmId,
    });

    return farm.joinCode;
  },
};

module.exports = { authService };

// Farmer registration: when a farmer signs up and creates a farm, an activity logs that this farmer and farm were created.
// Worker registration: when a worker joins via a join code, an activity records that this worker joined a given farm.
// Platform admin registration: when a platform admin account is created, an activity notes this onboarding event.
// Profile update: when a user updates name/phone, an activity captures the profile change.
// Join code regeneration: when a farm’s join code is regenerated, an activity documents that security‑sensitive action and links it to the farm
