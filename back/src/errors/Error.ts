import { HttpStatus } from "../enums/statusHTTP";

export class ErrorCustomised extends Error {
  private status: HttpStatus = 400;

  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message);
    status = this.status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  getStatusHTTP(): HttpStatus {
    return this.status;
  }

  setStatusHTTP(status: HttpStatus) {
    this.status = status;
  }
}
