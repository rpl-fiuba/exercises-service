const createError = require('http-errors');
const expressify = require('expressify')();
const usersService = require('../services/usersService');

/**
 * Add course exercises to user.
 *
 */
const addUser = async (req, res) => {
  const {
    courseId
  } = req.params;

  const { userId } = req.body;

  if (!userId) {
    return Promise.reject(createError.BadRequest('userId should be provided'));
  }

  await usersService.addUser({
    context: req.context,
    courseId,
    userId
  });

  return res.status(201).send({});
};

module.exports = expressify({
  addUser
});
