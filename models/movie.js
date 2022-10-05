const mongoose = require('mongoose');
const { NotFoundError, ForbiddenError } = require('../errors');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    trailerLink: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
);

movieSchema.statics.findMovieAndCheckOwner = function findMovieAndCheckOwner(movieID, userId) {
  return this.findOne({ _id: movieID })
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new NotFoundError('Фильм не найден!'));
      }
      if (movie.owner.toString() !== userId) {
        return Promise.reject(new ForbiddenError('Вы не имеет прав на удаление этого фильма!'));
      }
      return movie;
    });
};

module.exports = mongoose.model('movie', movieSchema);
