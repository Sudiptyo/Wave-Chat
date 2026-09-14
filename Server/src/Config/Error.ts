class ApiError extends Error {
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number = 500,
    message: string,
    retryable: boolean = false,
    isOperational: boolean = true,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
