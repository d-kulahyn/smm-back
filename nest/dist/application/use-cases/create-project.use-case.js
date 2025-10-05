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
exports.CreateProjectUseCase = void 0;
const common_1 = require("@nestjs/common");
const project_entity_1 = require("../../domain/entities/project.entity");
const project_status_enum_1 = require("../../domain/enums/project-status.enum");
let CreateProjectUseCase = class CreateProjectUseCase {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    async execute(command) {
        const project = new project_entity_1.Project(crypto.randomUUID(), command.name, command.ownerId, command.description, command.status || project_status_enum_1.ProjectStatus.ACTIVE, command.startDate, command.endDate, command.budget, command.avatar, command.color, command.metadata);
        return this.projectRepository.create(project);
    }
};
exports.CreateProjectUseCase = CreateProjectUseCase;
exports.CreateProjectUseCase = CreateProjectUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PROJECT_REPOSITORY')),
    __metadata("design:paramtypes", [Object])
], CreateProjectUseCase);
//# sourceMappingURL=create-project.use-case.js.map