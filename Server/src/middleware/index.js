const { protect } = require('./auth.middleware');
const { authorizeRoles } = require('./role.middleware');
const { errorHandler } = require('./error.middleware');
const notFound = require('./notFound.middleware');
const upload = require('./upload.middleware');

module.exports = {
    protect,
    authorizeRoles,
    errorHandler,
    notFound,
    upload
};