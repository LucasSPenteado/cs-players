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

  try {
    const parsedBody = bodySchema.parse(req.body);
    const { email, firstName, lastName, password } = parsedBody;
    const userCheck = await prisma.user.findUnique({ where: { email: email } });
    if (userCheck) {
      throw new AuthenticationError("");
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

    const userPayload = { email, firstName, lastName, id: newUser.id };

    const refreshToken = await generateRefreshToken(userPayload);

    const accessToken = generateAccessToken(userPayload);

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
      .status(201)
      .send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }
    if (error instanceof AuthenticationError) {
      return next(new AuthenticationError("This email is already in use"));
    }
    return next(new DataBaseError("Database error try again later"));
  }
};
