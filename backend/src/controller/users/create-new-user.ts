import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "@/errors/authentication-error.js";
import { generateAccessToken } from "@/utils/generate-access-token.js";
import { generateRefreshToken } from "@/utils/generate-refresh-token.js";

export const userCreateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bodySchema = z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
  });

  let parsedBody;

  try {
    parsedBody = bodySchema.parse(req.body);
    const { email, firstName, lastName, password } = parsedBody;
    const userCheck = await prisma.user.findUnique({ where: { email: email } });
    if (userCheck) {
      return next(new AuthenticationError("This email is already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    const userPayload = await prisma.user.findUnique({
      where: {
        id: newUser.id,
        email: newUser.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    if (!userPayload) {
      throw next(new DataBaseError(""));
    }

    const refreshToken = await generateRefreshToken(userPayload);

    const accessToken = generateAccessToken(userPayload);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: newUser.id },
    });

    return res
      .json({ refreshToken: refreshToken, accessToken: accessToken })
      .status(201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }
    return next(new DataBaseError("Database error try again later"));
  }
};
