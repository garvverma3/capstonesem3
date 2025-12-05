/*
  Warnings:

  - Added the required column `category` to the `Drug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `Drug` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drug" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_stock',
    "supplierId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Drug_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Drug" ("createdAt", "description", "id", "name", "price", "quantity", "supplierId", "updatedAt") SELECT "createdAt", "description", "id", "name", "price", "quantity", "supplierId", "updatedAt" FROM "Drug";
DROP TABLE "Drug";
ALTER TABLE "new_Drug" RENAME TO "Drug";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
