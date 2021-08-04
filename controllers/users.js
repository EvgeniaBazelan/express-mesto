const User = require('../models/user');
const { BadRequest, NotFound, InternalServerError } = require('./errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Not Found') {
        err.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'Not Found') {
        err.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'Not Found') {
        err.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
