const { INPUT_DATA_UNVALID_CODE } = require('../utils/httpCodes');

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INPUT_DATA_UNVALID_CODE;
  }
}

module.exports = InvalidDataError;
