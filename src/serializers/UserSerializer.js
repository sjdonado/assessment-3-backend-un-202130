const BaseSerializer = require('./BaseSerializer');

class UserSerializer extends BaseSerializer {
  constructor(model) {
    const serializedModel = model != null ? { ...model } : null;

    delete serializedModel?.password;
    delete serializedModel?.active;

    super('success', serializedModel);
  }
}

module.exports = UserSerializer;

