class ApiError extends Error {
  constructor(
    statuscode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);

    this.errors = errors;
  }
}
export { ApiError };