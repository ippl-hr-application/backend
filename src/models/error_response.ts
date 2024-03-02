export class ErrorResponse extends Error {
  statusCode: number;
  tags: string[] | undefined;

  constructor(message: string, statusCode: number, tags?: string[] ) {
    super(message);
    this.statusCode = statusCode;
    this.tags = tags;
  }
}
