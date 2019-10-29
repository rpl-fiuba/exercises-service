const createError = require('http-errors');
const expressify = require('expressify')();
const usersService = require('../services/usersService'); // TODO: CAMBIAR NOMBRE A USERS EXERCISES

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

/**
 * List exercises.
 *
 */
const listExercises = async (req, res) => {
  const {
    courseId,
    guideId
  } = req.params;

  const exercises = await usersService.listExercises({
    context: req.context,
    guideId,
    courseId
  });
  return res.status(200).json(exercises);
};

module.exports = expressify({
  addUser,
  listExercises
});
