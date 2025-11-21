-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "reminderBeforeHours" INTEGER;
