export class HTTPError extends Error {
  statusCode: number;
  message: string;
  context?: string;

  constructor(statusCode: number, message: string, context?: string) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
  }
}
