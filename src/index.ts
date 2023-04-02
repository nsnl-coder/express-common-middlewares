const checkIdExistence = require('./middlewares/checkIdExistence');
const globalErrorHandler = require('./middlewares/checkIdExistence');
const requireLogin = require('./middlewares/requireLogin');
const requireRole = require('./middlewares/requireRole');
const routeNotFound = require('./middlewares/routeNotFound');

export {
  checkIdExistence,
  requireLogin,
  requireRole,
  routeNotFound,
  globalErrorHandler,
};
