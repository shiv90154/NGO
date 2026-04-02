// 🛡️ ROLE-BASED ACCESS CONTROL
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${req.user.role}`,
      });
    }
    next();
  };
};

// 📦 MODULE-BASED ACCESS (check if user has a specific module enabled)
exports.hasModuleAccess = (moduleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    if (!req.user.modules || !req.user.modules.includes(moduleName)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: ${moduleName} module not enabled for your account`,
      });
    }
    next();
  };
};