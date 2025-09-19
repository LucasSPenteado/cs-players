/*
  Warnings:

  - You are about to drop the column `age` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teams` on the `Player` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentTeam" TEXT,
    "achievements" TEXT
);
INSERT INTO "new_Player" ("achievements", "currentTeam", "id", "name", "nickName") SELECT "achievements", "currentTeam", "id", "name", "nickName" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
