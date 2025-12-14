-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "nearestStation" TEXT,
    "buildYear" INTEGER,
    "buildMonth" INTEGER,
    "layout" TEXT,
    "area" REAL,
    "structure" TEXT,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "direction" TEXT,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "petAllowed" BOOLEAN NOT NULL DEFAULT false,
    "managementFee" INTEGER,
    "repairReserve" INTEGER,
    "renovationHistory" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "images" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "area", "buildMonth", "buildYear", "city", "createdAt", "description", "id", "images", "layout", "nearestStation", "prefecture", "price", "title", "updatedAt", "userId") SELECT "address", "area", "buildMonth", "buildYear", "city", "createdAt", "description", "id", "images", "layout", "nearestStation", "prefecture", "price", "title", "updatedAt", "userId" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
