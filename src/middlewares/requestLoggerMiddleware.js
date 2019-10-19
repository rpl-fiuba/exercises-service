const logger = require('../utils/logger.js');

/**
 * Log every request.
 *
 */
module.exports = (req, res, next) => {
  logger.onLog('Request:', `${req.method} ${req.url}`);

  return next();
};
