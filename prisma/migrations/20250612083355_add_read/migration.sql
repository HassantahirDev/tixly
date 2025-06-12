-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "eventCategoryId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
