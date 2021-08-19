const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const InternalServerError = require('../errors/InternalServerError');
const { NotFoundError } = require('../errors/Errors');
const { handleErrors } = require('../errors/HandleErrors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(InternalServerError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь с таким Id не существует'))
    .then((user) => res.send(user))
    .catch((err) => handleErrors(res, err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Данные пользователя не корректны' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUser = (req, res) => {
  const id = req.user._id;
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(id, {
    name,
    about,
  }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с таким Id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Данные пользователя не корректны' });
      }
      return handleErrors(res, err);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с таким Id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Ссылка на аватар не корректна' });
      }
      return handleErrors(res, err);
    });
};
