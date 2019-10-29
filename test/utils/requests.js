const url = require('url');
const fetch = require('node-fetch');
const configs = require('../../configs/test');

const baseUrl = url.format(configs.app);

const status = () => {
  const statusUrl = `${baseUrl}/ping`;

  return fetch(statusUrl);
};

// Exercises

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

const updateExercise = async ({
  token, courseId, guideId, exerciseId, exercise = {}
}) => {
  const createExUrl = `${baseUrl}/courses/${courseId}/guides/${guideId}/exercises/${exerciseId}`;

  const response = await fetch(createExUrl, {
    method: 'patch',
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

const addUser = async ({ token, courseId, user }) => {
  const addUserUrl = `${baseUrl}/courses/${courseId}/users`;

  const response = await fetch(addUserUrl, {
    method: 'post',
    body: JSON.stringify(user),
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  });
  return { status: response.status, body: await response.json() };
};

// User exercises
const listUserExercises = async ({ token, courseId, guideId }) => {
  const addUserUrl = `${baseUrl}/courses/${courseId}/guides/${guideId}/user/exercises`;

  const response = await fetch(addUserUrl, {
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
  addUser,
  createExercise: errorWrapper(createExercise),
  listExercises: errorWrapper(listExercises),
  listUserExercises: errorWrapper(listUserExercises),
  updateExercise: errorWrapper(updateExercise),
  status
};
