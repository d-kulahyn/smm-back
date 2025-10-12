-- CreateTable
CREATE TABLE "file_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadPath" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "fileGroupId" TEXT,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "chunks" INTEGER NOT NULL DEFAULT 0,
    "totalChunks" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "file_groups_entityType_entityId_idx" ON "file_groups"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "file_groups_name_entityType_entityId_key" ON "file_groups"("name", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "files_entityType_entityId_idx" ON "files"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "files_fileGroupId_idx" ON "files"("fileGroupId");

-- CreateIndex
CREATE INDEX "files_uploadedBy_idx" ON "files"("uploadedBy");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_fileGroupId_fkey" FOREIGN KEY ("fileGroupId") REFERENCES "file_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
