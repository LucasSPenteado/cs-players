import { dataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { badRequestError } from "@/errors/bad-request-error.js";
import { AuthenticationError } from "@/errors/authentication-error.js";

export const userController = async (
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }
    return next(
      new badRequestError("Something went wrong when requesting from the body")
    );
  }
  const { email, firstName, lastName, password } = parsedBody;

  try {
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
      select: { id: true, email: true, createdAt: true },
    });

    if (!userPayload) {
      return next(new dataBaseError("Database error try again later"));
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return next(new dataBaseError("ACCESS_TOKEN_SECRET is not defined"));
    }

    const acessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET);

    return res.json({ accessToken: acessToken }).status(201);
  } catch {
    return next(new dataBaseError("Database error try again later"));
  }
};
