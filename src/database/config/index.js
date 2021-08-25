const { TEST_DATABASE_URL } = require('../../config');

module.exports = {
  test: {
    url: TEST_DATABASE_URL,
    dialect: 'sqlite',
  },
};
