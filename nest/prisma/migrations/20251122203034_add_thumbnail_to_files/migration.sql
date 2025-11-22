-- AlterTable
ALTER TABLE "files" ADD COLUMN     "thumbnailId" TEXT;

-- CreateIndex
CREATE INDEX "files_thumbnailId_idx" ON "files"("thumbnailId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
