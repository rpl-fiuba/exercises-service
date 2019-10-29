const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../config')();
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Get user exercises.
 *
 */
const getExercises = async ({ userId }) => (
  knex.select()
    .from('student_exercises')
    .where('user_id', userId)
    .then(processDbResponse)
);


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
  getExercises,
  insertExercises
};
