import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";

export const listAll = async (req: Request, res: Response) => {
  const playersList = await prisma.player.findMany({
    include: { Achievements: true },
  });

  return res.json(playersList);
};
