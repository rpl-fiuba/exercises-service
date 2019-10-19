const devConfs = require('./configs/dev');
const testConfs = require('./configs/test');

module.exports = {
  dev: {
    ...devConfs.db,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    ...testConfs.db,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
