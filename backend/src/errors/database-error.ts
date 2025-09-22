import { CustomError } from "@/utils/custom-error.js";

export class dataBaseError extends CustomError {
  StatusCode = 500;
  constructor(public message: string) {
    super("Database crashed. Try again later.");
    Object.setPrototypeOf(this, dataBaseError.prototype);
  }
  serialize(): { message: string } {
    return { message: this.message };
  }
}
