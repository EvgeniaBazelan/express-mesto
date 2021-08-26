const { isCelebrateError } = require('celebrate');

function handleErrors(res, err) {
  if (isCelebrateError(err)) {
    if (!err.details.get('body') && err.details.get('params')) {
      return res.status(400).send({ message: err.details.get('params').message });
    }
    return res.status(400).send({ message: err.details.get('body').message });
  }
  if (err.name === 'CastError') {
    return res.status(400)
      .send({ message: `${err.message}` });
  }
  if (['NotFound', 'Forbidden', 'BadRequest', 'Unauthorized', 'ConflictingRequest'].indexOf(err.name) >= 0) {
    return res.status(err.statusCode)
      .send({ message: `${err.message}` });
  }
  return res.status(500)
    .send({ message: 'Произошла ошибка' });
}

module.exports = { handleErrors };
