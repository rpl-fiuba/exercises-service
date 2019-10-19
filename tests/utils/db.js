const _ = require('lodash');
const configs = require('../../configs/test');

const knex = require('knex')(configs.db); // eslint-disable-line

const sanitizeResponse = (response) => {
  if (_.isArray(response)) {
    return response.map((obj) => sanitizeResponse(obj));
  }
  delete response.id; // TODO: NO NECESARIAMENTE
  return response;
};

const cleanDb = async () => {
  await knex('users').del();
};

module.exports = {
  knex,
  cleanDb,
  sanitizeResponse
};
