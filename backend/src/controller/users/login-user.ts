import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bodySchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  let parsedBody;

  try {
    parsedBody = bodySchema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }
    return next(
      new BadRequestError("Something went wrong when requesting from the body")
    );
  }

  const { email, password } = parsedBody;

  try {
    const isMatch = await prisma.user.findUnique({
      where: { email: email, password: password },
      select: { email: true, password: true },
    });
    if (!isMatch) {
      return next(new DataBaseError(""));
    }
  } catch {
    return next(new DataBaseError("Database error try again later"));
  }
};
