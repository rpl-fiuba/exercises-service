const createError = require('http-errors');

const exercisesDB = require('../databases/exercisesDb');
const userExercisesDB = require('../databases/userExercisesDb');

/**
 * Add course exercises to user.
 *
 */
const addUser = async ({
  context,
  courseId,
  userId
}) => {
  const currentUserExercises = await userExercisesDB.listExercises({ context, userId });

  if (currentUserExercises.length) {
    throw createError.Conflict('Can not add exercises to an existing user');
  }
  const courseExercises = await exercisesDB.listExercises({
    context,
    courseId
  });
  const userExercises = courseExercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    userId
  }));

  return userExercisesDB.insertExercises({ context, userExercises });
};

const listExercises = async ({
  context,
  guideId,
  courseId
}) => {
  const { user } = context;

  return userExercisesDB.listExercises({
    context,
    userId: user.userId,
    guideId,
    courseId
  });
};

module.exports = {
  addUser,
  listExercises
};
