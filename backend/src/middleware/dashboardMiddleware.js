// Extract and verify JWT, attach payload to req.user
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No auth header or invalid format");
    return res.status(401).json({ error: "Unauthorized", code: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT payload:", payload);
    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ error: "Unauthorized", code: 401 });
  }
};

// Ensure JWT role is platform_admin
const requirePlatformAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "platform_admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Platform admin only.", code: 403 });
  }
  next();
};
module.exports.authenticate = authenticate;
module.exports.requirePlatformAdmin = requirePlatformAdmin;
