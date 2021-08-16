function NotFoundError(message) {
  this.message = message;
  this.name = 'NotFoundError';
  this.code = 404;
}

function ForbiddenError(message) {
  this.message = message;
  this.name = 'ForbiddenError';
  this.code = 401;
}

NotFoundError.prototype = new Error();
ForbiddenError.prototype = new Error();

module.exports = {
  NotFoundError,
  ForbiddenError,
};
