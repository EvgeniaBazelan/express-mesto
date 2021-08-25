class ConflictingRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'ConflictingRequest';
  }
}

module.exports = ConflictingRequest;
