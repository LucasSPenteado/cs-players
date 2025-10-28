import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { generateAccessToken } from "@/utils/generate-access-token.js";
import { generateRefreshToken } from "@/utils/generate-refresh-token.js";
import { AuthenticationError } from "@/errors/authentication-error.js";
import { BadRequestError } from "@/errors/bad-request-error.js";

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bodySchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  try {
    const parsedBody = bodySchema.parse(req.body);

    if (!parsedBody) {
      throw next(new BadRequestError(""));
    }

    const { email, password } = parsedBody;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw next(new AuthenticationError(""));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw next(new AuthenticationError(""));
    }

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };

    const refreshToken = await generateRefreshToken(userData);

    const accessToken = generateAccessToken(userData);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }

    if (error instanceof BadRequestError) {
      return next(new BadRequestError("Invalid request data"));
    }

    if (error instanceof AuthenticationError) {
      return next(new AuthenticationError("Wrong email or password"));
    }

    return next(new DataBaseError("Database error try again later"));
  }
};
