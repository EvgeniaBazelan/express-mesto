const router = require('express').Router();
const { login } = require('../controllers/users');
const { createUser } = require('../controllers/users');

const { validateSigIn, validateSigUp } = require('../middlewares/Validation');

router.post('/signin', validateSigIn, login);

router.post('/signup', validateSigUp, createUser);

module.exports = router;
