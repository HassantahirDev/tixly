/*
  Warnings:

  - You are about to drop the column `userId` on the `EventRegistration` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_userId_fkey";

-- AlterTable
ALTER TABLE "EventRegistration" DROP COLUMN "userId";
