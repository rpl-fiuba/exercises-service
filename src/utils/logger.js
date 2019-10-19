const { NODE_ENV } = process.env;
const TEST_ENV = 'test';

const onError = (funName, res, err) => {
  if (err.stack && NODE_ENV !== TEST_ENV) {
    console.log(`Error in: ${funName}\n`, err.stack);
  } else if (NODE_ENV !== TEST_ENV) {
    console.log(`Error in: ${funName}\n`, err);
  }
};

const onLog = (message = '', details = '') => {
  if (NODE_ENV !== TEST_ENV) {
    console.log(message, details);
  }
};

module.exports = {
  onError,
  onLog
};
