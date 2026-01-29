import BasicError from './error-model';

class UnauthorizedError extends BasicError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default UnauthorizedError;
