import { CustomError } from "@/utils/custom-error.js";

export class badRequestError extends CustomError {
  StatusCode = 400;

  constructor(public message: string) {
    super("Something went wrong when requesting the body");
    Object.setPrototypeOf(this, badRequestError.prototype);
  }

  serialize(): { message: string } {
    return { message: this.message };
  }
}
