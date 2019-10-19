const url = require('url');
const fetch = require('node-fetch');
const configs = require('../../configs/test');

const baseUrl = url.format(configs.app);

const status = () => {
  const statusUrl = `${baseUrl}/ping`;

  return fetch(statusUrl);
};

const login = async ({ token }) => {
  const profileUrl = `${baseUrl}/login`;

  const response = await fetch(profileUrl, {
    headers: {
      authorization: token
    }
  });
  return { status: response.status, body: await response.json() };
};

const signup = async ({ token, userMetadata }) => {
  const profileUrl = `${baseUrl}/signup`;

  const response = await fetch(profileUrl, {
    method: 'post',
    body: JSON.stringify(userMetadata),
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  });
  return { status: response.status, body: await response.json() };
};


const getProfile = async ({ userId, token }) => {
  const profileUrl = `${baseUrl}/users/${userId}/profile`;

  const response = await fetch(profileUrl, {
    headers: {
      authorization: token
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
  signup: errorWrapper(signup),
  login: errorWrapper(login),
  getProfile: errorWrapper(getProfile),
  status: errorWrapper(status)
};
