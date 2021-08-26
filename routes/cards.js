const router = require('express').Router();
const { getCards } = require('../controllers/cards');
const { createCard } = require('../controllers/cards');
const { deleteCardById } = require('../controllers/cards');
const { likeCard } = require('../controllers/cards');
const { dislikeCard } = require('../controllers/cards');
const { validateCard, validateId } = require('../middlewares/Validation');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:id', validateId, deleteCardById);
router.put('/:id/likes', validateId, likeCard);
router.delete('/:id/likes', validateId, dislikeCard);

module.exports = router;
