/*
  Warnings:

  - You are about to drop the column `organiserId` on the `EventRegistration` table. All the data in the column will be lost.
  - Added the required column `organizerId` to the `EventRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventRegistration" DROP COLUMN "organiserId",
ADD COLUMN     "organizerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" TEXT;
