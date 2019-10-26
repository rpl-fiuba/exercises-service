const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../config')();
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Create exercise.
 *
 */
const createExercise = async ({ courseId, guideId, exerciseMetadata }) => (
  knex('exercises')
    .insert(snakelize({
      ...exerciseMetadata,
      guideId,
      courseId
    }))
    .returning('*')
    .then(processDbResponse)
    .then((response) => response[0])
    .catch((err) => {
      if (err.code === '23505') { // TODO: WHHAAAAATTT ???
        throw new createError.Conflict('Exercise already created');
      }
      throw err.message;
    })
);

/**
 * List exercise.
 *
 */
const listExercises = async ({ courseId, guideId }) => (
  knex('exercises')
    .select('*')
    .where('course_id', courseId)
    .where('guide_id', guideId)
    .then(processDbResponse)
    .catch((err) => {
      if (err.code === '23505') { // TODO: WHHAAAAATTT ???
        throw new createError.Conflict('Exercise already created');
      }
      throw err.message;
    })
);

/**
 * Update exercise.
 *
 */
const updateExercise = async ({
  courseId,
  guideId,
  exerciseId,
  exerciseMetadata
}) => (
  knex('exercises')
    .update(snakelize(exerciseMetadata))
    .where('course_id', courseId)
    .where('guide_id', guideId)
    .where('exercise_id', exerciseId)
    .returning('*')
    .then(processDbResponse)
    .catch((err) => {
      console.log('EXERCISE ERROR', err);
      throw err.message;
    })
);

module.exports = {
  createExercise,
  listExercises,
  updateExercise
};
