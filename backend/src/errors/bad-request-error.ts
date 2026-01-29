import BasicError from './error-model';

class BadRequestError extends BasicError {
  constructor(message: string) {
    super(message, 400);
  }
}

export default BadRequestError;
