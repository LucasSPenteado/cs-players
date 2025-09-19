import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";
import z from "zod";

export const createPlayer = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    name: z.string(),
    nickName: z.string(),
    dateOfBirth: z.string().refine((value) => !isNaN(Date.parse(value))),
    currentTeam: z.string().optional(),
    achievements: z.string(),
  });
  const { name, nickName, dateOfBirth, currentTeam, achievements } =
    bodySchema.parse(req.body);
  const player = await prisma.player.create({
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
