"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = exports.USER_REPOSITORY = exports.TASK_REPOSITORY = exports.PROJECT_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const project_controller_1 = require("../api/controllers/project.controller");
const storage_controller_1 = require("../api/controllers/storage.controller");
const create_project_use_case_1 = require("../../application/use-cases/create-project.use-case");
const complete_project_use_case_1 = require("../../application/use-cases/complete-project.use-case");
const get_project_stats_use_case_1 = require("../../application/use-cases/get-project-stats.use-case");
const prisma_project_repository_1 = require("../repositories/prisma-project.repository");
const prisma_task_repository_1 = require("../repositories/prisma-task.repository");
const prisma_user_repository_1 = require("../repositories/prisma-user.repository");
const prisma_service_1 = require("../database/prisma.service");
const chat_service_1 = require("../services/chat.service");
const shared_1 = require("../../shared");
const shared_2 = require("../../shared");
const chat_schema_1 = require("../database/schemas/chat.schema");
exports.PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';
exports.TASK_REPOSITORY = 'TASK_REPOSITORY';
exports.USER_REPOSITORY = 'USER_REPOSITORY';
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: chat_schema_1.Chat.name, schema: chat_schema_1.ChatSchema },
            ]),
        ],
        controllers: [project_controller_1.ProjectController, storage_controller_1.StorageController],
        providers: [
            create_project_use_case_1.CreateProjectUseCase,
            complete_project_use_case_1.CompleteProjectUseCase,
            get_project_stats_use_case_1.GetProjectStatsUseCase,
            chat_service_1.ChatService,
            prisma_service_1.PrismaService,
            shared_1.FileService,
            shared_2.ProjectPolicy,
            {
                provide: exports.PROJECT_REPOSITORY,
                useClass: prisma_project_repository_1.PrismaProjectRepository,
            },
            {
                provide: exports.TASK_REPOSITORY,
                useClass: prisma_task_repository_1.PrismaTaskRepository,
            },
            {
                provide: exports.USER_REPOSITORY,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [shared_1.FileService, shared_2.ProjectPolicy],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map