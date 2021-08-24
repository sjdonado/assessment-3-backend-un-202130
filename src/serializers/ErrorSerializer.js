const BaseSerializer = require('./BaseSerializer');

class ErrorSerializer extends BaseSerializer {
  constructor(message) {
    super(message, null);
  }
}

module.exports = ErrorSerializer;
