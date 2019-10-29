const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../config')();
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Get user exercises.
 *
 */
const listExercises = async ({
  userId,
  guideId,
  courseId
}) => knex
  .select()
  .from('student_exercises')
  .innerJoin('exercises', function innerJoinFn() {
    this.on('student_exercises.exercise_id', 'exercises.exercise_id');
  })
  .where(snakelize({ userId, guideId, courseId }))
  .orderBy('exercises.name') // TODO: CAMBIAR POR CREATED DATE
  .then(processDbResponse);

/**
 * Insert user exercises in bulk.
 *
 */
const insertExercises = async ({ userExercises }) => (
  knex('student_exercises')
    .insert(userExercises.map(snakelize))
    .returning('*')
    .then(processDbResponse)
    .then((response) => response[0])
);

module.exports = {
  insertExercises,
  listExercises
};
