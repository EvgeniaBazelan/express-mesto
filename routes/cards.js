const router = require('express').Router();
// const Card = require('../models/card');
const getCards = require('../controllers/cards');
const createCard = require('../controllers/cards');
const deleteCardById = require('../controllers/cards');
const likeCard = require('../controllers/cards');
const dislikeCard = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

// router.get('/', (req, res) => {
//   Card.find({})
//     // eslint-disable-next-line no-unused-vars,no-undef
//     .then((cards) => res.send({ data: cards }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
// router.get('/:cardId', (req, res) => {
//   Card.findById(req.params.id)
//     .then((card) => res.send({ data: card }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
//
// // сработает при POST-запросе на URL /films
// router.post('/', (req, res) => {
//   const { name, link } = req.body;
//   Card.create({ name, link })
//     .then((card) => res.send({ data: card }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// });
// router.put('/:id/likes', (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true },)
// });
// router.delete('/:id/likes', (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true },
//   )
// });
// router.use((req, res) => {
//   res.status(404).send({ ... });
// }
module.exports = router;
