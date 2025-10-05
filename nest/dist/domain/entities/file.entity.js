"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntity = void 0;
class FileEntity {
    constructor(id, filename, originalName, mimeType, size, uploadPath, entityType, entityId, uploadedBy, isComplete = false, chunks = 0, totalChunks, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.filename = filename;
        this.originalName = originalName;
        this.mimeType = mimeType;
        this.size = size;
        this.uploadPath = uploadPath;
        this.entityType = entityType;
        this.entityId = entityId;
        this.uploadedBy = uploadedBy;
        this.isComplete = isComplete;
        this.chunks = chunks;
        this.totalChunks = totalChunks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        return new FileEntity(params.id, params.filename, params.originalName, params.mimeType, params.size, params.uploadPath, params.entityType, params.entityId, params.uploadedBy, false, 0, params.totalChunks, new Date(), new Date());
    }
    markChunkUploaded() {
        return new FileEntity(this.id, this.filename, this.originalName, this.mimeType, this.size, this.uploadPath, this.entityType, this.entityId, this.uploadedBy, this.totalChunks ? (this.chunks + 1) >= this.totalChunks : false, this.chunks + 1, this.totalChunks, this.createdAt, new Date());
    }
    markComplete() {
        return new FileEntity(this.id, this.filename, this.originalName, this.mimeType, this.size, this.uploadPath, this.entityType, this.entityId, this.uploadedBy, true, this.chunks, this.totalChunks, this.createdAt, new Date());
    }
    toPlainObject() {
        return {
            id: this.id,
            filename: this.filename,
            originalName: this.originalName,
            mimeType: this.mimeType,
            size: this.size,
            uploadPath: this.uploadPath,
            entityType: this.entityType,
            entityId: this.entityId,
            uploadedBy: this.uploadedBy,
            isComplete: this.isComplete,
            chunks: this.chunks,
            totalChunks: this.totalChunks,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
exports.FileEntity = FileEntity;
//# sourceMappingURL=file.entity.js.map