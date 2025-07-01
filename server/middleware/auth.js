const jwt = require("jsonwebtoken");

// Middleware to verify JWT and attach user to request
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to restrict access to a specific role
const restrictTo = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Middleware to allow only ward officers (e.g., role = "ward_north")
const wardOnly = (req, res, next) => {
  if (!req.user || !req.user.role?.startsWith("ward_")) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// ✅ Export all three functions together properly
module.exports = {
  protect,
  restrictTo,
  wardOnly,
};
