import { CustomError } from "@/utils/custom-error.js";

export class DataBaseError extends CustomError {
  StatusCode = 500;
  constructor(public message: string) {
    super("Database crashed. Try again later.");
    Object.setPrototypeOf(this, DataBaseError.prototype);
  }
  serialize(): { message: string } {
    return { message: this.message };
  }
}
