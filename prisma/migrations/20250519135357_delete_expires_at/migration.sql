/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "token" DROP COLUMN "expiresAt";
