const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');
const Unauthorized = require('../errors/Unauthorized');
const Forbidden = require('../errors/Forbidden');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFound('Пользователь с таким Id не существует'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return next(new BadRequest('Email или пароль не могут быть пустыми'));
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new Forbidden('Пользователь уже существует'));
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        })
        // eslint-disable-next-line no-shadow
          .then((user) => {
            res.status(201).send(user.toJSON());
          }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequest('Ошибка при создании пользователя');
          } else if (err.name === 'MongoError' && err.code === 11000) {
            throw new ConflictingRequest('Пользователь с таким E-mail уже существует');
          }
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const id = req.user._id;
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(id, {
    name,
    about,
  }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь с таким Id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Данные пользователя не корректны');
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь с таким Id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Ссылка на аватар не корректна');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Id не корректен');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secretKey123',
        { expiresIn: 604800000 },
      );

      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => next(new Unauthorized(`Пользователь не авторизован + ${err.message}`)));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFound('Пользователь с таким Id не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new NotFound('Пользователь по указанному _id не найден!');
      }
    })
    .catch(next);
};
