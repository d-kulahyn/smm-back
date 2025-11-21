-- AlterTable
ALTER TABLE "files" ADD COLUMN     "deviceId" TEXT;

-- CreateIndex
CREATE INDEX "files_deviceId_idx" ON "files"("deviceId");
