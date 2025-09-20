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
    CONSTRAINT "Achievements_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Achievements" ("blast", "dreamhack", "eslProLeague", "iem", "major", "playerId") SELECT "blast", "dreamhack", "eslProLeague", "iem", "major", "playerId" FROM "Achievements";
DROP TABLE "Achievements";
ALTER TABLE "new_Achievements" RENAME TO "Achievements";
CREATE UNIQUE INDEX "Achievements_playerId_key" ON "Achievements"("playerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
