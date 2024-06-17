const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../config')();
const knex = require('knex')(configs.db); // eslint-disable-line

const commonColumns = [
  'exercise_id',
  'guide_id',
  'course_id',
  'created_at',
  'problem_input',
  'name',
  'description',
  'initial_hint',
  'type',
  'difficulty',
  'pipeline_status',
];

const commonPlaygroundColumns = [
  'exercise_id',
  'created_at',
  'problem_input',
  'name',
  'type',
  'state'
];


/**
 * Get exercise.
 *
 */
const getExercise = async ({ courseId, guideId, exerciseId }) => (
  knex('exercises')
    .select()
    .where(snakelize({
      guideId,
      courseId,
      exerciseId,
    }))
    .then(processDbResponse)
    .then((response) => response[0])
);

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
    .returning(commonColumns)
    .then(processDbResponse)
    .then((response) => response[0])
);

const createPlaygroundExercise = async ({ userId, exerciseMetadata }) => (
  knex('student_playground_exercises')
    .insert(snakelize({
      ...exerciseMetadata,
      userId,
    }))
    .returning(['exercise_id', 'created_at'])
    .then(processDbResponse)
    .then((response) => response[0])
);

const getPlaygroundExercise = async ({ exerciseId, userId }) => (

  knex('student_playground_exercises')
    .select('student_playground_exercises.*')
    .where('student_playground_exercises.exercise_id', exerciseId)
    .where('student_playground_exercises.user_id', userId)
    .then(processDbResponse)
    .then((response) => {
      if (!response[0]) {
        throw createError.NotFound('Exercise not found');
      }
      return response[0];
    })
);

const getPlaygroundExercises = async ({ userId }) => (
  knex('student_playground_exercises')
    .select(commonPlaygroundColumns)
    .where('student_playground_exercises.user_id', userId)
    .orderBy('created_at')
    .then(processDbResponse)
);


const updatePlaygroundExercise = async ({
  userId,
  exerciseId,
  exerciseMetadata
}) => (
  knex('student_playground_exercises')
    .update(snakelize(exerciseMetadata))
    .where(snakelize({
      userId,
      exerciseId
    }))
    .returning('*')
    .then(processDbResponse)
    .then((response) => {
      if (!response[0]) {
        throw createError.NotFound('Exercise not found');
      }
      return response[0];
    })
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
    .select(commonColumns)
    .where(snakelize({
      courseId,
      guideId
    }))
    .orderBy('created_at')
    .then(processDbResponse);
};

/**
 * List course exercises.
 *
 */
const listCourseExercises = async ({ courseId }) => {
  if (!courseId) {
    throw new Error('courseId should be defined');
  }

  return knex('exercises')
    .select('*')
    .where(snakelize({ courseId }))
    .then(processDbResponse);
};

/**
 * List exercises by ids
 *
 */
const listExercisesByIds = async ({ courseId, guideId, exerciseIds }) => {
  if (!courseId && !guideId) {
    throw new Error('at least courseId or guideId should be defined');
  }

  return knex('exercises')
    .select('*')
    .where(snakelize({
      courseId,
      guideId
    }))
    .whereIn('exercise_id', exerciseIds)
    .orderBy('created_at')
    .then(processDbResponse);
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

/**
 * Remove exercise.
 *
 */
const removeExercise = async ({ courseId, guideId, exerciseId }) => {
  const trx = await knex.transaction();
  await trx.delete()
    .from('exercises')
    .where(snakelize({
      courseId,
      guideId,
      exerciseId
    }));

  await trx.delete()
    .from('student_exercises')
    .where(snakelize({ exerciseId }));

  await trx.commit();
};

const removePlaygroundExercise = async ({ userId, exerciseId }) => {
  const trx = await knex.transaction();
  await trx.delete()
    .from('student_playground_exercises')
    .where(snakelize({
      userId,
      exerciseId
    }));
  await trx.commit();
};


/**
 * Add exercises into course
 *
 */
const insertExercises = async ({ exercises }) => (
  knex('exercises')
    .insert(snakelize(exercises))
    .returning(commonColumns)
    .then(processDbResponse)
);


module.exports = {
  createExercise,
  insertExercises,
  getExercise,
  listCourseExercises,
  listExercisesByIds,
  listExercises,
  removeExercise,
  updateExercise,
  createPlaygroundExercise,
  getPlaygroundExercise,
  updatePlaygroundExercise,
  getPlaygroundExercises,
  commonColumns,
  removePlaygroundExercise
};
