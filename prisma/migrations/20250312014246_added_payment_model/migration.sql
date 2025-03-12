/*
  Warnings:

  - You are about to drop the column `eventId` on the `TicketsPayment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `TicketsPayment` table. All the data in the column will be lost.
  - You are about to drop the `BankDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `TicketsPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenshotUrl` to the `TicketsPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TicketsPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankDetails" DROP CONSTRAINT "BankDetails_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "TicketsPayment" DROP CONSTRAINT "TicketsPayment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TicketsPayment" DROP CONSTRAINT "TicketsPayment_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "TicketsPayment" DROP CONSTRAINT "TicketsPayment_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "organizerBankDetailsId" TEXT;

-- AlterTable
ALTER TABLE "TicketsPayment" DROP COLUMN "eventId",
DROP COLUMN "paymentId",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "screenshotUrl" TEXT NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "BankDetails";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "OrganizerBankDetails" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,

    CONSTRAINT "OrganizerBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminBankDetails" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,

    CONSTRAINT "AdminBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tickets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "eventId" TEXT NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistrationPayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "screenshotUrl" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT,

    CONSTRAINT "EventRegistrationPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizerBankDetails" ADD CONSTRAINT "OrganizerBankDetails_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminBankDetails" ADD CONSTRAINT "AdminBankDetails_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "TicketsPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "EventRegistrationPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrationPayment" ADD CONSTRAINT "EventRegistrationPayment_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketsPayment" ADD CONSTRAINT "TicketsPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizerBankDetailsId_fkey" FOREIGN KEY ("organizerBankDetailsId") REFERENCES "OrganizerBankDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
