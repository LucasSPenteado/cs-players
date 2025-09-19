import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";
import z from "zod";

export const updatePlayer = async (req: Request, res: Response) => {
  const paramsSchema = z.object({
    id: z.string().transform((value) => parseInt(value)),
    name: z.string(),
    nickName: z.string(),
    dateOfBirth: z.iso.datetime(),
    currentTeam: z.string(),
    achievements: z.string(),
  });
  const bodySchema = z.object({
    name: z.string(),
    nickName: z.string(),
    dateOfBirth: z.string().refine((value) => !isNaN(Date.parse(value))),
    currentTeam: z.string().optional(),
    achievements: z.string(),
  });
  const { id } = paramsSchema.parse(req.params);
  const { name, nickName, achievements, dateOfBirth, currentTeam } =
    bodySchema.parse(req.body);

  const player = await prisma.player.update({
    where: { id },
    data: {
      name: name,
      nickName: nickName,
      currentTeam: currentTeam ?? null,
      achievements: achievements,
      dateOfBirth: new Date(dateOfBirth),
    },
  });

  const formattedPlayer = {
    ...player,
    dateOfBirth: player.dateOfBirth.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };

  return res.json(formattedPlayer);
};
