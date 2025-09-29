import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playersList = await prisma.player.findMany({
      include: { Achievements: true },
    });

    return res.json(playersList);
  } catch {
    return next(new DataBaseError("Database error try again later"));
  }
};
