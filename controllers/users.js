const User = require('../models/user');
const { BadRequest, NotFound, InternalServerError } = require('./errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      if (res.status === BadRequest) {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status === NotFound) {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status === BadRequest) {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status === BadRequest) {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      } else if (res.status === NotFound) {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status === BadRequest) {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      } else if (res.status === NotFound) {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
