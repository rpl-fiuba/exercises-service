/**
 * Initialize the context.
 *
 */
module.exports = (req, res, next) => {
  req.context = {
    token: req.headers.authorization
  };

  return next();
};
