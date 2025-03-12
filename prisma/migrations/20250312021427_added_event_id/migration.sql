/*
  Warnings:

  - Added the required column `eventId` to the `TicketsPayment` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `TicketsPayment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TicketsPayment" DROP CONSTRAINT "TicketsPayment_userId_fkey";

-- AlterTable
ALTER TABLE "TicketsPayment" ADD COLUMN     "eventId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TicketsPayment" ADD CONSTRAINT "TicketsPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketsPayment" ADD CONSTRAINT "TicketsPayment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
