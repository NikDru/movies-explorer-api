const mongoose = require('mongoose');
const emailValidator = require('validator');
const bcrypt = require('bcryptjs');
const { NotAuthorizedError, AlreadyExistError } = require('../errors');

/* Пример фильма (для упрощения тестирования)
{
  "name": "Nik",
  "email": "123@123.com",
  "password": "123"
}
*/

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(email) {
          return emailValidator.isEmail(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
  },
  {
    toObject: { useProjection: true },
    toJSON: { useProjection: true },
  },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthorizedError());
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizedError());
          }
          return user;
        });
    });
};

userSchema.statics.checkEmailForChange = function findMovieAndCheckOwner(id, newMail) {
  return this.findOne({ email: newMail })
    .then((user) => {
      if (user && String(user._id) !== id) {
        return Promise.reject(new AlreadyExistError('Данный email не может быть использован!'));
      }
      return Promise.resolve();
    });
};

module.exports = mongoose.model('user', userSchema);
