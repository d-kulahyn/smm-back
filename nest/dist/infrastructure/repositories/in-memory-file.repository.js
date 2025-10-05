"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryFileRepository = void 0;
const common_1 = require("@nestjs/common");
const file_entity_1 = require("../../domain/entities/file.entity");
let InMemoryFileRepository = class InMemoryFileRepository {
    constructor() {
        this.files = new Map();
        this.uploadedChunks = new Map();
    }
    async create(file) {
        this.files.set(file.id, file);
        this.uploadedChunks.set(file.id, new Set());
        return file;
    }
    async findById(id) {
        console.log(this.files);
        return this.files.get(id) || null;
    }
    async findByEntityId(entityType, entityId) {
        return Array.from(this.files.values()).filter(file => file.entityType === entityType && file.entityId === entityId);
    }
    async update(id, updates) {
        const file = this.files.get(id);
        if (!file) {
            throw new Error('File not found');
        }
        const updatedFile = new file_entity_1.FileEntity(file.id, updates.filename ?? file.filename, file.originalName, file.mimeType, updates.size ?? file.size, file.uploadPath, file.entityType, file.entityId, file.uploadedBy, updates.isComplete ?? file.isComplete, updates.chunks ?? file.chunks, file.totalChunks, file.createdAt, new Date());
        this.files.set(id, updatedFile);
        return updatedFile;
    }
    async delete(id) {
        this.files.delete(id);
        this.uploadedChunks.delete(id);
    }
    async markChunkUploaded(id, chunkIndex) {
        const file = this.files.get(id);
        if (!file) {
            throw new Error('File not found');
        }
        const fileChunks = this.uploadedChunks.get(id) || new Set();
        if (chunkIndex !== undefined) {
            fileChunks.add(chunkIndex);
        }
        this.uploadedChunks.set(id, fileChunks);
        const chunksCount = fileChunks.size;
        const isComplete = file.totalChunks ? chunksCount >= file.totalChunks : false;
        const updatedFile = new file_entity_1.FileEntity(file.id, file.filename, file.originalName, file.mimeType, file.size, file.uploadPath, file.entityType, file.entityId, file.uploadedBy, isComplete, chunksCount, file.totalChunks, file.createdAt, new Date());
        this.files.set(id, updatedFile);
        return updatedFile;
    }
    async markComplete(id) {
        const file = this.files.get(id);
        if (!file) {
            throw new Error('File not found');
        }
        const updatedFile = new file_entity_1.FileEntity(file.id, file.filename, file.originalName, file.mimeType, file.size, file.uploadPath, file.entityType, file.entityId, file.uploadedBy, true, file.chunks, file.totalChunks, file.createdAt, new Date());
        this.files.set(id, updatedFile);
        return updatedFile;
    }
    async getUploadedChunks(id) {
        const chunks = this.uploadedChunks.get(id);
        return chunks ? Array.from(chunks).sort((a, b) => a - b) : [];
    }
    async getMissingChunks(id) {
        const file = this.files.get(id);
        if (!file || !file.totalChunks) {
            return [];
        }
        const uploadedChunks = this.uploadedChunks.get(id) || new Set();
        const missing = [];
        for (let i = 0; i < file.totalChunks; i++) {
            if (!uploadedChunks.has(i)) {
                missing.push(i);
            }
        }
        return missing;
    }
    async isChunkUploaded(id, chunkIndex) {
        const chunks = this.uploadedChunks.get(id);
        return chunks ? chunks.has(chunkIndex) : false;
    }
};
exports.InMemoryFileRepository = InMemoryFileRepository;
exports.InMemoryFileRepository = InMemoryFileRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryFileRepository);
//# sourceMappingURL=in-memory-file.repository.js.map