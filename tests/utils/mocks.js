const nock = require('nock');

const mockGoogleAuth = ({ status = 200, response = {} }) => {
  nock('https://www.googleapis.com/oauth2/v2')
    .get('/userinfo')
    .reply(status, response);
};

module.exports = {
  mockGoogleAuth
};
