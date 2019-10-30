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

/**
 * List user exercises.
 *
 */
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

/**
 * Get user exercise.
 *
 */
const getExercise = async ({
  context,
  guideId,
  courseId,
  exerciseId
}) => {
  const { user } = context;

  return userExercisesDB.getExercise({
    context,
    userId: user.userId,
    guideId,
    courseId,
    exerciseId
  });
};

const updateExercise = async ({
  context,
  userId,
  guideId,
  courseId,
  exerciseId,
  exerciseMetadata
}) => (
  userExercisesDB.updateExercise({ // TODO: VALIDAR QUE EXISTA EL EJERCICIOS ? Y SI LO PONEMOS EN UN MIDDLEWARE ?
    context,
    userId,
    guideId,
    courseId,
    exerciseId,
    exerciseMetadata
  })
);

module.exports = {
  addUser,
  getExercise,
  listExercises,
  updateExercise
};
