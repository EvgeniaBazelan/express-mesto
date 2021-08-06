const Card = require('../models/card');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Вы не заполнили обязательные поля или данные не верны');
      }
    })
    .catch((err) => {
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};

const deleteCardById = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена!');
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.id)
          // eslint-disable-next-line no-shadow
          .then((card) => {
            res.send(card);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequest('Неправильный id');
            }
          })
          .catch((err) => {
            err.status(500).send({ message: 'Произошла ошибка' });
          });
      } else {
        throw new Forbidden('Недостаточно прав для удаления карточки');
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      err.status(500).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена!');
    })
    // eslint-disable-next-line no-unused-vars
    .then((card) => {
      Card.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user } },
        { new: true },
      )
        // eslint-disable-next-line no-shadow
        .then((card) => res.send(card))
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequest('Ошибка валидации данных');
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

const dislikeCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена!');
    })
    // eslint-disable-next-line no-unused-vars
    .then((card) => {
      Card.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        // eslint-disable-next-line no-shadow
        .then((card) => res.send(card))
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

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
