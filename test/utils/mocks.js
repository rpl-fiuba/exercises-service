const nock = require('nock');
const url = require('url');
const configs = require('../../configs/test');

const usersServiceUrl = url.format(configs.services.usersService.url);

const mockAuth = ({ status = 200, profile = {}, times = 1 }) => {
  nock(usersServiceUrl)
    .get('/login')
    .times(times)
    .reply(status, profile);
};

module.exports = {
  mockAuth
};
