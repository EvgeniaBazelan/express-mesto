const User = require('../models/user');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Ошибка при получении пользователей');
      }
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Пользователь с таким Id не существует');
    })
    .then(({ _id }) => {
      User.findById(_id)
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequest('Неправильный id');
          }
        })
        .catch((err) => {
          err.status(500).send({ message: 'Произошла ошибка' });
        });
    })
    .catch((err) => {
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Ошибка при создании пользователя');
      }
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about })
    .orFail(() => {
      throw new NotFound('Пользователь с таким Id не существует');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Данные пользователя не корректны');
      } else if (err.name === 'Not Found') {
        err.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar })
    .orFail(() => {
      throw new NotFound('Пользователь с таким Id не существует');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Ссылка на аватар не корректна');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Id не корректен');
      }
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};
