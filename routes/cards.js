const router = require('express').Router();
// const Card = require('../models/card');
const { getCards } = require('../controllers/cards');
const { createCard } = require('../controllers/cards');
const { deleteCardById } = require('../controllers/cards');
const { likeCard } = require('../controllers/cards');
const { dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;
