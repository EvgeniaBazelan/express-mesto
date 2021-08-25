class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'Forbidden';
  }
}

module.exports = Forbidden;
