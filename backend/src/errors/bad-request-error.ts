import { CustomError } from "@/utils/custom-error.js";

export class badRequestError extends CustomError {
  StatusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, badRequestError.prototype);
  }

  serialize(): { message: string } {
    return { message: this.message };
  }
}
