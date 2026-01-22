import BasicError from './error-model';

class ConflictError extends BasicError {
  constructor(message: string) {
    super(message, 404);
  }
}

export default ConflictError;
