const router = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');
const { ValidateMovieID, ValidateMovieBody } = require('../utils/JoiValidators');

router.get('/', getMovies);

router.delete('/:movieId', ValidateMovieID, deleteMovie);

router.post('/', ValidateMovieBody, createMovie);

module.exports = router;
