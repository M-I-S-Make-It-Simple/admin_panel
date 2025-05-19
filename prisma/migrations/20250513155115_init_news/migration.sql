-- CreateTable
CREATE TABLE "News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "publication_date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT '[]'
);
