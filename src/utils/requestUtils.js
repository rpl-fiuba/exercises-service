const createError = require('http-errors');

const processResponse = async (response) => {
  if (response.status >= 300) {
    throw createError(response.status, await response.json());
  }
  return response.json();
};

module.exports = {
  processResponse
};
