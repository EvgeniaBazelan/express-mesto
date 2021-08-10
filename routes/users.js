const router = require('express').Router();
// const User = require('../models/user');

const { getUsers } = require('../controllers/users');
const { getUserId } = require('../controllers/users');
const { createUser } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { updateUserAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateUser);
router.get('/:id', getUserId);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
