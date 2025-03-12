-- AlterTable
ALTER TABLE "TicketsPayment" ADD COLUMN     "qrCodeUrl" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
