import { DataBaseError } from "@/errors/database-error.js";
import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const findOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsSchema = z.object({
    id: z.string().transform((value) => parseInt(value)),
  });

  try {
    const parsedParams = paramsSchema.parse(req.params);
    const { id } = parsedParams;
    const player = await prisma.player.findUnique({
      where: { id },
      include: { Achievements: true },
    });

    return res.json(player);
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
