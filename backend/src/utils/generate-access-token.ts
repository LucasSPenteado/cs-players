import { DataBaseError } from "@/errors/database-error.js";
import type { NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayLoadProps {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export const generateAccessToken = (
  userPayLoad: UserPayLoadProps,
  next: NextFunction
) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return next(new DataBaseError("No access token defined"));
  }
  return jwt.sign(userPayLoad, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
};
