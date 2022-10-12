const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('Заголовок с токеном не найден или некорректен');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    let secretKey = '';
    if (NODE_ENV !== 'production') {
      secretKey = 'myUnicPassword';
    } else {
      secretKey = JWT_SECRET;
    }
    payload = jwt.verify(token, secretKey);
    // Проверяем токен, т.к. с базой могло что-то случится и данного пользователя уже не существует
    User.findById(payload)
      .exec()
      .then((user) => {
        if (!user) {
          throw new NotAuthorizedError('Токен не валиден, попробуйте еще раз');
        }
      })
      .catch((err) => next(err));
  } catch (err) {
    throw new NotAuthorizedError('Токен не валиден');
  }

  req.user = payload;

  next();
};
