const models = require('./models');

const init = async () => {
  await models.sequelize.authenticate();
  await models.sequelize.sync();
};

module.exports = {
  init,
};
