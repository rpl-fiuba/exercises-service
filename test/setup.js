// Starts the app
if (global.server) {
  global.server.server.close();
}
// eslint-disable-next-line global-require
global.server = require('../src/app.js');
