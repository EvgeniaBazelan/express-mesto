const Card = require('../models/card');

// const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
// const Forbidden = require('../errors/Forbidden');
const InternalServerError = require('../errors/InternalServerError');
const {
  NotFoundError,
  ForbiddenError,
} = require('../errors/Errors');

function HandleErrors(res) {
  return function (err) {
    if (err.name === 'CastError') {
      return res.status(BadRequest)
        .send({ message: 'Неправильный id' });
    }
    if (['NotFoundError', 'ForbiddenError'].indexOf(err.name) >= 0) {
      return res.status(err.code)
        .send(err.message);
    }
    return res.status(InternalServerError)
      .send({ message: 'Произошла ошибка' });
  };
}

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(InternalServerError)
      .send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body;
  const ownerId = req.user._id;
  Card.create({
    name,
    link,
    owner: ownerId,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Вы не заполнили обязательные поля или данные не верны' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка' });
    });
};

const deleteCardById = (req, res) => {
  // noinspection JSCheckFunctionSignatures
  Card.findById(req.params.id)
    .orFail(new NotFoundError('Карточка с таким id не найдена!'))
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        // noinspection JSCheckFunctionSignatures
        return Card.findByIdAndRemove(req.params.id);
      }
      throw new ForbiddenError('Недостаточно прав для удаления карточки');
    })
    .then(() => res.status(200)
      .send({ message: 'Карточка удалена' }))
    .catch(HandleErrors(res));
};

const likeCard = (req, res) => {
  // noinspection JSCheckFunctionSignatures
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с таким id не найдена!'))
    .then((card) => res.send(card))
    .catch(HandleErrors(res));
};

// const dislikeCard = (req, res) => {
// Card.findById(req.params.id)
// .orFail(() => {
//   res.status(NotFound)
//     .send({ message: 'Карточка с таким id не найдена!' });
// })
// eslint-disable-next-line no-unused-vars
// .then((card) => {
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с таким id не найдена!'))
    // eslint-disable-next-line no-shadow
    .then((card) => res.send(card))
    .catch(HandleErrors(res));
};
//         .catch((err) => {
//           if (err.name === 'CastError') {
//             return res.status(BadRequest)
//               .send({ message: 'Неправильный id' });
//           }
//           return res.status(InternalServerError)
//             .send({ message: 'Произошла ошибка' });
//         });
//     })
//     .catch(() => res.status(InternalServerError)
//       .send({ message: 'Произошла ошибка' }));
// };

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
