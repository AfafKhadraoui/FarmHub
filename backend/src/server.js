const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");

// Import Middleware
const { authenticateToken } = require("./middleware/authMiddleware");

// Import Services
const notificationBgService = require("./services/notificationBackoundService.js");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const workerRoutes = require("./routes/workerRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const fieldRoutes = require("./routes/fieldRoutes");
const notifRoutes = require("./routes/user_notifications");
const weatherRoutes = require("./routes/weather");
const settingsRoutes = require("./routes/settingsRoutes");

// Initialize App
dotenv.config();
const app = express();

// ==========================================
// 1. Cron Jobs (Scheduled Tasks)
// ==========================================

// Check for overdue tasks every hour
cron.schedule("0 * * * *", async () => {
  await notificationBgService.runAllChecks();
});

// Send daily summaries at 8:00 AM every day
cron.schedule("0 8 * * *", async () => {
  await notificationBgService.runDailySummary();
});

// ==========================================
// 2. Global Middleware
// ==========================================

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder (static files)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// CORS: allow Next.js (http://localhost:3000) + send cookies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// JSON parser + cookies
app.use(express.json());
app.use(cookieParser());

// ==========================================
// 3. Application Routes
// ==========================================

// --- Auth Routes ---
app.use("/api/auth", authRoutes);

// --- Admin Routes ---
// (These modules likely handle their own admin verification internally)
app.use("/admin", require("./routes/farms"));
app.use("/admin", require("./routes/notifications"));
app.use("/admin", require("./routes/admin"));
app.use("/admin", require("./routes/activities"));

// --- User Core Routes ---
app.use("/profile", require("./routes/profile")); // Profile for current user
app.use("/tasks", taskRoutes); // Task management
app.use("/workers", workerRoutes); // Worker management
app.use("/dashboard", dashboardRoutes); // Dashboard data

// --- Protected Feature Routes (Explicit Auth) ---
// These routes explicitly require the token in the main file
app.use("/fields", authenticateToken, fieldRoutes);
app.use("/userNotifications", authenticateToken, notifRoutes); // For worker and farmer
app.use("/weather", authenticateToken, weatherRoutes); // For worker and farmer

// --- Settings Routes ---
// Settings for farmer, profile logic for worker/farmer
app.use("/api", settingsRoutes);

// ==========================================
// 4. Health Checks & Server Start
// ==========================================

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.send("The server is working fine ... ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
