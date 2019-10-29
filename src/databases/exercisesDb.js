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
);

/**
 * List exercise.
 *
 */
const listExercises = async ({ courseId, guideId }) => {
  if (!courseId && !guideId) {
    throw new Error('at least courseId or guideId should be defined');
  }

  return knex('exercises')
    .select('*')
    .where(snakelize({ courseId, guideId }))
    .then(processDbResponse)
    .catch((e) => console.log(e));
};

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
    .then((response) => {
      if (!response[0]) {
        throw createError.NotFound('Exercise not found');
      }
      return response[0];
    })
);

module.exports = {
  createExercise,
  listExercises,
  updateExercise
};
