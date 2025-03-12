/*
  Warnings:

  - Added the required column `eventId` to the `EventRegistrationPayment` table without a default value. This is not possible if the table is not empty.
  - Made the column `organizerId` on table `EventRegistrationPayment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EventRegistrationPayment" DROP CONSTRAINT "EventRegistrationPayment_organizerId_fkey";

-- AlterTable
ALTER TABLE "EventRegistrationPayment" ADD COLUMN     "eventId" TEXT NOT NULL,
ALTER COLUMN "organizerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventRegistrationPayment" ADD CONSTRAINT "EventRegistrationPayment_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrationPayment" ADD CONSTRAINT "EventRegistrationPayment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
