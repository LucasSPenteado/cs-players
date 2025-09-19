/*
  Warnings:

  - Added the required column `age` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickName` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teams` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "currentTeam" TEXT,
    "teams" TEXT NOT NULL,
    "achievements" TEXT
);
INSERT INTO "new_Player" ("id", "name") SELECT "id", "name" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
