module.exports = function config() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
  }

  // eslint-disable-next-line
  return require(`../configs/${process.env.NODE_ENV}`);
};
