"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = exports.TASK_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
const task_controller_1 = require("../../infrastructure/api/controllers/task.controller");
const create_task_use_case_1 = require("../use-cases/create-task.use-case");
const complete_task_use_case_1 = require("../use-cases/complete-task.use-case");
const prisma_task_repository_1 = require("../../infrastructure/repositories/prisma-task.repository");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const file_service_1 = require("../../shared/services/file.service");
const auth_service_1 = require("../../shared/services/auth.service");
const task_policy_1 = require("../../shared/policies/task.policy");
exports.TASK_REPOSITORY = 'TASK_REPOSITORY';
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = __decorate([
    (0, common_1.Module)({
        controllers: [task_controller_1.TaskController],
        providers: [
            create_task_use_case_1.CreateTaskUseCase,
            complete_task_use_case_1.CompleteTaskUseCase,
            prisma_service_1.PrismaService,
            file_service_1.FileService,
            auth_service_1.AuthService,
            task_policy_1.TaskPolicy,
            {
                provide: exports.TASK_REPOSITORY,
                useClass: prisma_task_repository_1.PrismaTaskRepository,
            },
        ],
        exports: [task_policy_1.TaskPolicy],
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map