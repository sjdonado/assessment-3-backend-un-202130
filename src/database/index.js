const models = require('./models');

const init = async () => {
  await models.sequelize.authenticate();
  await models.sequelize.sync();

  models.sequelize.afterConnect(async (config) => {
    console.log('Database connected!');
  });
};

module.exports = {
  init,
};
