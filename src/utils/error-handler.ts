export class ApiError extends Error {
  message: string = "";
  code: number;
  data?: Object | string = {};

  constructor(code: number, message: string, data?: Object | string) {
    super(message);
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
