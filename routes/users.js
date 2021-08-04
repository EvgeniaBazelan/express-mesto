const router = require('express').Router();
// const User = require('../models/user');
const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');
const NotFound = require('../controllers/errors');

router.get('/', getUsers);
// router.get('/me', updateUser);
router.patch('/me', updateUser);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/me/avatar', updateUserAvatar);
router.use((req, res) => {
  res.status(NotFound).send({ message: 'ресурс не найден' });
});

module.exports = router;

// router.get('/', (req, res) => {
//   User.find({})
//     // eslint-disable-next-line no-unused-vars,no-undef
//     .then((users) => res.send({ data: users }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
// router.get('/:userId', (req, res) => {
//   User.findById(req.params.id)
//     .then((user) => res.send({ data: user }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
//
// // сработает при POST-запросе на URL /films
// router.post('/', (req, res) => {
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     .then((user) => res.send({ data: user }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
// router.patch('/me', (req, res) => {
//   // eslint-disable-next-line no-undef,no-restricted-globals
//   const id = req.user._id;
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(id, { name, about })
//     .then((user) => res.send(user))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
// router.patch('/me/avatar', (req, res) => {
//   // eslint-disable-next-line no-undef
//   const id = req.user._id;
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(id, { avatar })
//     .then((user) => res.send(user))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
// router.use((req, res) => {
//   res.status(404).send({ ... });
// }
