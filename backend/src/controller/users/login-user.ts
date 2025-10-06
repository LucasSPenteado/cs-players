import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { generateAccessToken } from "@/utils/generate-access-token.js";
import { generateRefreshToken } from "@/utils/generate-refresh-token.js";

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

    const { email, password } = parsedBody;

    const user = await prisma.user.findUnique({
      where: { email: email, password: password },
    });

    if (!user) {
      throw next(new BadRequestError(""));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw next(new BadRequestError("Wrong email or password"));
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!userData) {
      throw next(new DataBaseError(""));
    }

    const refreshToken = await generateRefreshToken(userData);

    const accessToken = generateAccessToken(userData);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id },
    });

    return res.json({ accessToken, refreshToken }).status(200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }

    if (error instanceof BadRequestError) {
      return next(new BadRequestError("Bad request"));
    }

    return next(new DataBaseError("Database error try again later"));
  }
};
