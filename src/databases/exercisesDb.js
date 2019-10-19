const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../config')();
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Create exercise.
 *
 */
const createUser = async ({ exerciseMetadata }) => (
  knex('exercises')
    .insert(snakelize(exerciseMetadata))
    .returning('*')
    .then(processDbResponse)
    .catch((err) => {
      if (err.code === '23505') { // TODO: WHHAAAAATTT ???
        throw new createError.Conflict('User already exists');
      }
      throw err;
    })
);

module.exports = {
  createUser
};
