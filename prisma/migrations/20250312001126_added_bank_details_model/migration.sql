/*
  Warnings:

  - You are about to drop the column `bankDetails` on the `Organizer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organizer" DROP COLUMN "bankDetails";

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
