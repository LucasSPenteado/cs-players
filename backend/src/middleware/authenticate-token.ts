import { AuthenticationError } from "@/errors/authentication-error.js";
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

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return next(new DataBaseError("REFRESH_TOKEN_SECRET is not defined"));
  }
  try {
    const { email } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    ) as { email: string };

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { email: true, firstName: true, lastName: true },
    });
    if (!user) {
      return next(new DataBaseError("No user with this token"));
    }

    req.user = user;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};
