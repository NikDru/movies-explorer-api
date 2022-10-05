const router = require('express').Router();
const {
  getUserInfo,
  changeUserInfo,
} = require('../controllers/users');
const { ValidateUserBodyForNameMail } = require('../utils/JoiValidators');

router.get('/me', getUserInfo);

router.patch('/me', ValidateUserBodyForNameMail, changeUserInfo);

module.exports = router;
