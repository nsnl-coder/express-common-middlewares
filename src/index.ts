const checkIdExistence = require('./middleware/checkIdExistence');
const globalErrorHandler = require('./middleware/checkIdExistence');
const requireLogin = require('./middleware/requireLogin');
const requireRole = require('./middleware/requireRole');
const routeNotFound = require('./middleware/routeNotFound');

export {
  checkIdExistence,
  requireLogin,
  requireRole,
  routeNotFound,
  globalErrorHandler,
};
