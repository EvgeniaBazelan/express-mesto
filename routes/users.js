const router = require('express').Router();

const { getUsers } = require('../controllers/users');
const { getUserId } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { updateUserAvatar } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const {
  validateUser,
  validateAvatar,
  validateId,
} = require('../middlewares/Validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', validateUser, updateUser);
router.get('/:id', validateId, getUserId);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

module.exports = router;
