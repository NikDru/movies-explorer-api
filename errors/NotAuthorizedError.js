const { NOT_AUTHORIZED_CODE } = require('../utils/httpCodes');

class NotAuthorizedError extends Error {
  constructor(message = 'Неправильные почта или пароль') {
    super(message);
    this.statusCode = NOT_AUTHORIZED_CODE;
  }
}

module.exports = NotAuthorizedError;
