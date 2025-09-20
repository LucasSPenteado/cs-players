import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";
import z from "zod";

export const deletePlayer = async (req: Request, res: Response) => {
  const paramsSchema = z.object({
    id: z.string().transform((value) => parseInt(value)),
  });
  const { id } = paramsSchema.parse(req.params);
  const player = await prisma.player.delete({
    where: { id },

    include: { Achievements: true },
  });

  return res.json(player);
};
