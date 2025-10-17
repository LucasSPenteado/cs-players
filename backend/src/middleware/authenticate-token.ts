import { env } from "@/env/index.js";
import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies;

    if (!cookie) {
      throw new BadRequestError("");
    }

    const accessToken = req.cookies.accessToken;

    const { email } = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as {
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new DataBaseError("");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof DataBaseError) {
      return next(new DataBaseError("Error fetching user from database"));
    }
    if (error instanceof BadRequestError) {
      return next(new BadRequestError("cookie does not exist"));
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};
