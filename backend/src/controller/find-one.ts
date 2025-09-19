import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";
import z from "zod";

export const findOne = async (req: Request, res: Response) => {
  const paramsSchema = z.object({
    id: z.string().transform((value) => parseInt(value)),
  });
  const { id } = paramsSchema.parse(req.params);
  const player = await prisma.player.findUnique({ where: { id } });

  return res.json(player);
};
