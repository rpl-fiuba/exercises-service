const url = require('url');
const fetch = require('node-fetch');
const configs = require('../../configs/test');

const baseUrl = url.format(configs.app);

const status = () => {
  const statusUrl = `${baseUrl}/ping`;

  return fetch(statusUrl);
};

const createExercise = async ({
  token, courseId, guideId, exercise = {}
}) => {
  const createExUrl = `${baseUrl}/courses/${courseId}/guides/${guideId}/exercises`;

  const response = await fetch(createExUrl, {
    method: 'post',
    body: JSON.stringify(exercise),
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  });
  return { status: response.status, body: await response.json() };
};


const listExercises = async ({ token, courseId, guideId }) => {
  const listExUrl = `${baseUrl}/courses/${courseId}/guides/${guideId}/exercises`;

  const response = await fetch(listExUrl, {
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  });
  return { status: response.status, body: await response.json() };
};

function errorWrapper(funct) {
  return function inner(...args) {
    try {
      return funct(...args);
    } catch (err) {
      return err;
    }
  };
}

module.exports = {
  createExercise: errorWrapper(createExercise),
  listExercises: errorWrapper(listExercises),
  status
};
