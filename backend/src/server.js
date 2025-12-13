const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// Middleware
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

// JSON + cookies
app.use(express.json());
app.use(cookieParser());

// Auth routes
const { authenticateToken, authorizeRoles } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Admin route modules (these already use authenticate / requirePlatformAdmin internally)
app.use("/admin", require("./routes/farms"));
app.use("/admin", require("./routes/notifications"));
app.use("/admin", require("./routes/admin"));
app.use("/admin", require("./routes/activities"));

// Profile routes for current user


// Profile routes for current user
app.use("/profile", require("./routes/profile"));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => {
  res.send("The server is working fine ... ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
