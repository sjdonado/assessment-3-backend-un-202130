const { DATABASE_URL, TEST_DATABASE_URL } = require('../../config');

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: TEST_DATABASE_URL,
    dialect: 'sqlite',
  },
};
