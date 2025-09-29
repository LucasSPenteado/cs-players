import { BadRequestError } from "@/errors/bad-request-error.js";
import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const updatePlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  let parsedParams;
  let parsedBody;

  try {
    parsedParams = paramsSchema.parse(req.params);
    parsedBody = bodySchema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.prettifyError(error),
      });
    }
    return next(
      new BadRequestError(
        "Something went wrong when requesting from params or body"
      )
    );
  }

  const { id } = parsedParams;
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

  try {
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
  } catch {
    return next(new DataBaseError("Database error try again later"));
  }
};
