"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModule = void 0;
const common_1 = require("@nestjs/common");
const storage_controller_1 = require("../api/controllers/storage.controller");
const chunked_file_service_1 = require("../../application/services/chunked-file.service");
const in_memory_file_repository_1 = require("../repositories/in-memory-file.repository");
const local_file_storage_service_1 = require("../services/local-file-storage.service");
let FileModule = class FileModule {
};
exports.FileModule = FileModule;
exports.FileModule = FileModule = __decorate([
    (0, common_1.Module)({
        controllers: [storage_controller_1.StorageController],
        providers: [
            chunked_file_service_1.ChunkedFileService,
            {
                provide: 'FILE_REPOSITORY',
                useClass: in_memory_file_repository_1.InMemoryFileRepository,
            },
            {
                provide: 'FILE_STORAGE_SERVICE',
                useClass: local_file_storage_service_1.LocalFileStorageService,
            },
            local_file_storage_service_1.LocalFileStorageService,
        ],
        exports: [chunked_file_service_1.ChunkedFileService, 'FILE_REPOSITORY', 'FILE_STORAGE_SERVICE'],
    })
], FileModule);
//# sourceMappingURL=file.module.js.map