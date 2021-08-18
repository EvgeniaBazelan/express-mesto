const BadRequest = require('./BadRequest');
const InternalServerError = require('./InternalServerError');
// const {
//   NotFoundError,
//   ForbiddenError,
// } = require('./Errors');

function handleErrors(res, err) {
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
}

// function handleErrors(res) {
//   return function (err) {
//     if (err.name === 'CastError') {
//       return res.status(BadRequest)
//         .send({ message: 'Неправильный id' });
//     }
//     if (['NotFoundError', 'ForbiddenError'].indexOf(err.name) >= 0) {
//       return res.status(err.code)
//         .send(err.message);
//     }
//     return res.status(InternalServerError)
//       .send({ message: 'Произошла ошибка' });
//   };
// }
module.exports = { handleErrors };
