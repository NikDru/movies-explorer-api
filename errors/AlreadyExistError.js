const { ALREADY_EXIST_CODE } = require('../utils/httpCodes');

class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ALREADY_EXIST_CODE;
  }
}

module.exports = AlreadyExistError;
