-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "choosen" BOOLEAN,
    "personName" TEXT,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);
