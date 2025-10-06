import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const createPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  let parsedBody;

  try {
    parsedBody = bodySchema.parse(req.body);

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
    } = parsedBody;

    const playerWithAchievements = await prisma.player.create({
      data: {
        name: name,
        nickName: nickName,
        currentTeam: currentTeam ?? null,
        dateOfBirth: dateOfBirth,

        Achievements: {
          create: {
            major: major ?? null,
            eslProLeague: eslProLeague ?? null,
            blast: blast ?? null,
            dreamhack: dreamhack ?? null,
            iem: iem ?? null,
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }
    return next(new DataBaseError("Database error try again later"));
  }
};
