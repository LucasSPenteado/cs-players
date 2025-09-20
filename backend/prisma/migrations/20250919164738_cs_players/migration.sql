/*
  Warnings:

  - You are about to drop the column `achievements` on the `Player` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Achievements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "major" TEXT,
    "eslProLeague" TEXT,
    "blast" TEXT,
    "dreamhack" TEXT,
    "iem" TEXT,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "Achievements_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentTeam" TEXT
);
INSERT INTO "new_Player" ("currentTeam", "dateOfBirth", "id", "name", "nickName") SELECT "currentTeam", "dateOfBirth", "id", "name", "nickName" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
