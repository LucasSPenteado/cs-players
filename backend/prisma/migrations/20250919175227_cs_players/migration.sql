/*
  Warnings:

  - You are about to alter the column `blast` on the `Achievements` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `dreamhack` on the `Achievements` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `eslProLeague` on the `Achievements` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `iem` on the `Achievements` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `major` on the `Achievements` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "major" INTEGER,
    "eslProLeague" INTEGER,
    "blast" INTEGER,
    "dreamhack" INTEGER,
    "iem" INTEGER,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "Achievements_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Achievements" ("blast", "dreamhack", "eslProLeague", "id", "iem", "major", "playerId") SELECT "blast", "dreamhack", "eslProLeague", "id", "iem", "major", "playerId" FROM "Achievements";
DROP TABLE "Achievements";
ALTER TABLE "new_Achievements" RENAME TO "Achievements";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
