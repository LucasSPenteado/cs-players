import { AuthenticationError } from "@/errors/authentication-error.js";
import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import { generateAccessToken } from "@/utils/generate-access-token.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return next(new BadRequestError("Bad request of cookies"));

  const refreshToken = req.cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  try {
    if (!refreshToken || !process.env.REFRESH_TOKEN_SECRET) {
      throw new AuthenticationError("");
    }

    const foundUser = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!foundUser) {
      throw new DataBaseError("No user with this token");
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const { id } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw new DataBaseError("");
    }

    const newAccessToken = generateAccessToken(user, next);

    const newRefreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    await prisma.refreshToken.create({
      data: { userId: id, token: newRefreshToken },
    });

    return res
      .json({ newRefreshToken: newRefreshToken, accessToken: newAccessToken })
      .status(200);
  } catch (error) {
    if (error instanceof DataBaseError) {
      return next(new DataBaseError("User not found"));
    }

    if (error instanceof AuthenticationError) {
      return next(new AuthenticationError("No token provided"));
    }

    if (error instanceof DataBaseError) {
      return next(new DataBaseError("No user with this token"));
    }
    return next(new Error("Internal server error"));
  }
};
