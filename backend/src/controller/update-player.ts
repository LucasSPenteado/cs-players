import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";
import z from "zod";

export const updatePlayer = async (req: Request, res: Response) => {
  const paramsSchema = z.object({
    id: z.string().transform((value) => parseInt(value)),
  });
  const bodySchema = z.object({
    name: z.string(),
    nickName: z.string(),
    dateOfBirth: z.preprocess(
      (value) => (typeof value === "string" ? new Date(value) : value),
      z.date()
    ),
    currentTeam: z.string().optional(),
    major: z.number().optional(),
    eslProLeague: z.number().optional(),
    blast: z.number().optional(),
    dreamhack: z.number().optional(),
    iem: z.number().optional(),
  });
  const { id } = paramsSchema.parse(req.params);
  const {
    name,
    nickName,
    dateOfBirth,
    currentTeam,
    major,
    eslProLeague,
    blast,
    dreamhack,
    iem,
  } = bodySchema.parse(req.body);

  const playerWithAchievements = await prisma.player.update({
    where: { id },
    data: {
      name: name,
      nickName: nickName,
      currentTeam: currentTeam ?? null,
      dateOfBirth: dateOfBirth,

      Achievements: {
        update: {
          where: { playerId: id },
          data: {
            major: major ?? null,
            eslProLeague: eslProLeague ?? null,
            blast: blast ?? null,
            dreamhack: dreamhack ?? null,
            iem: iem ?? null,
          },
        },
      },
    },
    include: { Achievements: true },
  });

  const formattedPlayer = {
    ...playerWithAchievements,
    dateOfBirth: playerWithAchievements.dateOfBirth.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };

  return res.json(formattedPlayer);
};
