-- AlterTable
ALTER TABLE "projects" ADD COLUMN "startDate" TIMESTAMP(3),
ADD COLUMN "endDate" TIMESTAMP(3),
ADD COLUMN "budget" DECIMAL(65,30),
ADD COLUMN "avatar" TEXT,
ADD COLUMN "color" TEXT,
ADD COLUMN "metadata" JSONB;

