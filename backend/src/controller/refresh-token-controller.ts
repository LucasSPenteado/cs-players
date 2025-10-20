import { env } from "@/env/index.js";
import { AuthenticationError } from "@/errors/authentication-error.js";
import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import { generateAccessToken } from "@/utils/generate-access-token.js";
import { generateRefreshToken } from "@/utils/generate-refresh-token.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return next(new BadRequestError("Bad request of cookies"));

  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  if (!refreshToken) {
    return next(new AuthenticationError("Not refresh token found"));
  }

  try {
    const { id } = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as {
      id: number;
    };

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const user = await prisma.user.findUnique({
      where: { id: id },
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

    const newAccessToken = generateAccessToken(user);

    const newRefreshToken = await generateRefreshToken(user);

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(201)
      .send();
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
