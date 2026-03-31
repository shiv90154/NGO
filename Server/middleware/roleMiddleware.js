const { isHigherOrEqual } = require('../constants/roles');
const { AppError } = require('../utils/AppError.js');

// ✅ Hierarchy based role check
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    const userRole = req.user.role;

    if (!isHigherOrEqual(userRole, requiredRole)) {
      return next(
        new AppError(
          `Access denied. Required role: ${requiredRole} or higher`,
          403
        )
      );
    }

    next();
  };
};

// ✅ Permission based check
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return next(
        new AppError(`Permission '${permission}' required`, 403)
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
  requirePermission,
};