const { assert } = require('chai');
const requests = require('./utils/requests');

describe('Integration status tests', () => {
  describe('Status', () => {
    let response;

    beforeEach(async () => {
      response = await requests.status();
    });

    it('GET status', () => assert.equal(response.status, 200));
  });
});
