import { CustomError } from "@/utils/custom-error.js";

export class envError extends CustomError {
  StatusCode = 500;
  constructor(public message: string) {
    super("Server misconfiguration.");
    Object.setPrototypeOf(this, envError.prototype);
  }
  serialize(): { message: string } {
    return { message: this.message };
  }
}
