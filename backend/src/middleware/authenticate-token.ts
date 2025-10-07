import { env } from "@/env/index.js";
import { AuthenticationError } from "@/errors/authentication-error.js";
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
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) return next(new AuthenticationError("No token provided"));

  try {
    const { email } = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as {
      email: string;
    };

    const cookies = req.cookies;
    if (!cookies?.jwt) throw new BadRequestError("");

    const refreshToken = req.cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    if (!refreshToken) {
      throw new AuthenticationError("");
    }

    jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

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
    if (error instanceof BadRequestError) {
      return next(new BadRequestError("Bad request of cookies"));
    }
    if (error instanceof DataBaseError) {
      return next(new DataBaseError("Error fetching user from database"));
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};
