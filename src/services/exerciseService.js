const exercisesDB = require('../databases/exercisesDb');

/**
 * Create exercise.
 *
 */
const create = async ({
  context,
  guideId,
  courseId,
  exerciseMetadata
}) => (
  exercisesDB.createExercise({
    context,
    guideId,
    courseId,
    exerciseMetadata
  })
);

/**
 * List exercises.
 *
 */
const list = async ({
  context,
  guideId,
  courseId
}) => (
  exercisesDB.listExercises({ // TODO: aca hacemos la separacion por usuario
    context,
    guideId,
    courseId
  })
);

/**
 * Update exercise.
 *
 */
const update = async ({
  context,
  guideId,
  courseId,
  exerciseId,
  exerciseMetadata
}) => (
  exercisesDB.updateExercise({
    context,
    guideId,
    courseId,
    exerciseId,
    exerciseMetadata
  })
);

module.exports = {
  create,
  list,
  update
};
