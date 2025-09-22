import { CustomError } from "@/utils/custom-error.js";
import type { ErrorRequestHandler, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response
) => {
  if (error instanceof CustomError) {
    return res.status(error.StatusCode).json(error.serialize());
  }
  return res.status(400).json({ message: "Something bad happened" });
};
