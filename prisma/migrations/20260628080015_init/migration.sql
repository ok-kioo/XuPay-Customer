/*
  Warnings:

  - Added the required column `city` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pixKey` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "pixKey" TEXT NOT NULL;
