const { AppError } = require('../utils/errorHandler');

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!req.user.permissions.includes(permission)) {
      return next(new AppError(`Missing required permission: ${permission}`, 403));
    }
    next();
  };
};

module.exports = { requirePermission };