"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskUseCase = void 0;
const common_1 = require("@nestjs/common");
const task_entity_1 = require("../../domain/entities/task.entity");
const enums_1 = require("../../domain/enums");
let CreateTaskUseCase = class CreateTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async execute(command) {
        const task = new task_entity_1.Task(crypto.randomUUID(), command.title, command.projectId, command.creatorId, command.description, enums_1.TaskStatus.pending, command.priority || enums_1.TaskPriority.MEDIUM, command.assignedTo, undefined, command.dueDate);
        return this.taskRepository.create(task);
    }
};
exports.CreateTaskUseCase = CreateTaskUseCase;
exports.CreateTaskUseCase = CreateTaskUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('TASK_REPOSITORY')),
    __metadata("design:paramtypes", [Object])
], CreateTaskUseCase);
//# sourceMappingURL=create-task.use-case.js.map