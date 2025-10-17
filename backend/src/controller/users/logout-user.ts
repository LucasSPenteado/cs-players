import { AuthenticationError } from "@/errors/authentication-error.js";
import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const logoutUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies;

    if (!cookie) {
      throw new BadRequestError("cookie does not exist");
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return next(new AuthenticationError("No token provided"));

    const { id } = jwt.decode(refreshToken) as { id: number };

    if (!id) {
      throw new AuthenticationError("");
    }

    const user = await prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    if (!user) {
      throw new DataBaseError("");
    }

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .send();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(new AuthenticationError("No user with this token"));
    }
    if (error instanceof DataBaseError) {
      return next(new DataBaseError("No user found in the DB"));
    }
    if (error instanceof BadRequestError) {
      return next(new BadRequestError("Failure of request"));
    }
    return console.log(error);
  }
};
