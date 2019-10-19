const createError = require('http-errors');

const usersClient = require('../clients/usersClient');

/**
 * Executes authentication and saves the profile in the context.
 *
 */
module.exports = async (req, res, next) => {
  const { context } = req;

  if (!context.token) {
    next(createError.BadRequest('Authorization has not been provided'));
  }

  try {
    const userProfile = await usersClient.authenticate({ context });
    req.context.userProfile = userProfile;
    next();
  } catch (err) {
    next(err);
  }
};
