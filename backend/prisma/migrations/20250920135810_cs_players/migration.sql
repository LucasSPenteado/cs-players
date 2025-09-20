/*
  Warnings:

  - The primary key for the `Achievements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Achievements` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievements" (
    "major" INTEGER,
    "eslProLeague" INTEGER,
    "blast" INTEGER,
    "dreamhack" INTEGER,
    "iem" INTEGER,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "Achievements_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Achievements" ("blast", "dreamhack", "eslProLeague", "iem", "major", "playerId") SELECT "blast", "dreamhack", "eslProLeague", "iem", "major", "playerId" FROM "Achievements";
DROP TABLE "Achievements";
ALTER TABLE "new_Achievements" RENAME TO "Achievements";
CREATE UNIQUE INDEX "Achievements_playerId_key" ON "Achievements"("playerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
