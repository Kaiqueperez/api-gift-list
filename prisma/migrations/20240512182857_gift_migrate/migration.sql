/*
  Warnings:

  - Added the required column `url` to the `Gift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "url" TEXT NOT NULL;
