// middleware/index.js
const { protect } = require('./auth.middleware');
const { authorizeRoles, hasModuleAccess } = require('./role.middleware');
const { validateRegister } = require('./validation.middleware');
const { upload, handleMulterError } = require('./upload.middleware');
const { otpLimiter, loginLimiter, apiLimiter } = require('./rateLimit.middleware');
const { errorHandler, AppError } = require('./error.middleware');
const notFound = require('./notFound.middleware');

module.exports = {
    protect,
    authorizeRoles,
    hasModuleAccess,
    validateRegister,
    upload,
    handleMulterError,
    otpLimiter,
    loginLimiter,
    apiLimiter,
    errorHandler,
    AppError,
    notFound,
};