const _ = require('lodash');

const camilize = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    newObj[_.camelCase(key)] = obj[key];
  });

  return newObj;
};

const snakelize = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    newObj[_.snakeCase(key)] = obj[key];
  });

  return newObj;
};


const processDbResponse = (dbObj) => {
  if (_.isArray(dbObj) && dbObj.length === 0) {
    return null;
  }
  const obj = _.isArray(dbObj) && dbObj.length === 1 ? dbObj[0] : dbObj;

  return _.isArray(obj) ? obj.map((item) => camilize(item)) : camilize(obj);
};


module.exports = {
  camilize,
  snakelize,
  processDbResponse
};
