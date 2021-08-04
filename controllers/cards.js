const Card = require('../models/card');
const { BadRequest, NotFound, InternalServerError } = require('./errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
// module.exports.getCard = (req, res) => {
//   Card.findById(req.params.id)
//     .then((card) => res.send({ data: card }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      err.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    }
    err.status(InternalServerError).send({ message: 'Произошла ошибка' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      err.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    }
    err.status(InternalServerError).send({ message: 'Произошла ошибка' });
  });
module.exports.deleteCardById = (req, res) => Card.findById(req.params.id)
  .then((card) => {
    if (card.owner._id.toString() === req.user._id) {
      Card.findByIdAndRemove(req.params.id)

      // eslint-disable-next-line no-shadow
        .then((card) => {
          res.send(card);
        })
        .catch((err) => {
          if (err.name === 'Not Found') {
            err.status(NotFound).send({ message: ' Карточка с указанным _id не найдена.' });
          }
          err.status(InternalServerError).send({ message: 'Произошла ошибка' });
        });
    }
  });
