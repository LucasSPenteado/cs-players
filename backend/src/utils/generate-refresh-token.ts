import { env } from "@/env/index.js";
import { prisma } from "@/lib/prisma.js";
import jwt from "jsonwebtoken";

interface UserPayLoadProps {
  id: number;
}

export const generateRefreshToken = async (userPayload: UserPayLoadProps) => {
  const refreshToken = jwt.sign(userPayload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "15s",
  });

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: userPayload.id },
  });

  return refreshToken;
};
