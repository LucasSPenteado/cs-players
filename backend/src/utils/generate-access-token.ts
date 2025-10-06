import { env } from "@/env/index.js";
import jwt from "jsonwebtoken";

interface UserPayLoadProps {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export const generateAccessToken = (userPayLoad: UserPayLoadProps) => {
  return jwt.sign(userPayLoad, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
};
