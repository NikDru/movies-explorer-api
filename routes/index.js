const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors');
const { ValidateUserBodyForSignUp, ValidateUserBodyForSignIn } = require('../utils/JoiValidators');

router.post('/signup', ValidateUserBodyForSignUp, createUser);

router.post('/signin', ValidateUserBodyForSignIn, login);

router.use(auth);

router.use('/users', userRouter);

router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Конечная точка не найдена'));
});

module.exports = router;
