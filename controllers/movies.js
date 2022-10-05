const Movie = require('../models/movie');
const { InvalidDataError } = require('../errors');
const { SUCCESS_CODE } = require('../utils/httpCodes');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.status(SUCCESS_CODE).send(movies))
    .catch((error) => next(error));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    nameRU,
    nameEN,
  })
    .then((movie) => movie.populate(['owner']).execPopulate())
    .then((movie) => {
      res.send(movie);
    })
    .catch((error) => {
      if (error._message === 'user validation failed' || error._message === 'Validation failed') {
        next(new InvalidDataError('Ошибка входных данных'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findMovieAndCheckOwner(req.params.movieId, req.user._id)
    .then((movie) => {
      Movie.findByIdAndRemove(
        movie._id,
        (err, deletedMovie) => {
          if (!deletedMovie) {
            next(new Error('Ошибка на сервере'));
          } else {
            res.status(SUCCESS_CODE).send({ message: 'Фильм удален' });
          }
        },
      );
    })
    .catch(next);
};
