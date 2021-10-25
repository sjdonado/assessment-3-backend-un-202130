const BaseSerializer = require('./BaseSerializer');

class UserSerializer extends BaseSerializer {
  constructor(model) {
    const serializedModel = model != null ? { ...model } : null;

    const tempActive = serializedModel.active;
    delete serializedModel?.password;
    delete serializedModel?.active;

    super('success', tempActive ? serializedModel : null);
  }
}

module.exports = UserSerializer;
