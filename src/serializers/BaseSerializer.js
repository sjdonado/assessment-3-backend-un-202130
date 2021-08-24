class BaseSerializer {
  constructor(status, data) {
    this.status = status;
    this.data = data;
  }

  toJSON() {
    return {
      status: this.status,
      data: this.data,
    };
  }
}

module.exports = BaseSerializer;
