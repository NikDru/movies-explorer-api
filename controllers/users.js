const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SUCCESS_CODE } = require('../utils/httpCodes');
const { NotFoundError, InvalidDataError, AlreadyExistError } = require('../errors');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err._message === 'user validation failed' || err._message === 'Validation failed') {
        next(new InvalidDataError('Ошибка входных данных'));
      } else if (err.code === 11000) {
        next(new AlreadyExistError('Пользователь с таким email уже зарегистрирован!'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      let secretKey = '';
      if (NODE_ENV !== 'production') {
        secretKey = 'myUnicPassword';
      } else {
        secretKey = JWT_SECRET;
      }
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((users) => res.status(SUCCESS_CODE).send(users))
    .catch((err) => next(err));
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name: newName, email: newEmail } = req.body;
  User.checkEmailForChange(req.user._id, newEmail)
    .then(() => User.findByIdAndUpdate(
      req.user._id,
      {
        name: newName,
        email: newEmail,
      },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
      .exec())
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(SUCCESS_CODE).send(user);
      }
    })
    .catch((err) => next(err));
};
