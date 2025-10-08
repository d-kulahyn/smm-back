"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInvitationModule = exports.USER_REPOSITORY = exports.PROJECT_INVITATION_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const project_invitation_controller_1 = require("../api/controllers/project-invitation.controller");
const send_project_invitation_use_case_1 = require("../../application/use-cases/send-project-invitation.use-case");
const accept_project_invitation_use_case_1 = require("../../application/use-cases/accept-project-invitation.use-case");
const decline_project_invitation_use_case_1 = require("../../application/use-cases/decline-project-invitation.use-case");
const prisma_project_invitation_repository_1 = require("../repositories/prisma-project-invitation.repository");
const prisma_user_repository_1 = require("../repositories/prisma-user.repository");
const prisma_service_1 = require("../database/prisma.service");
const email_service_1 = require("../services/email.service");
exports.PROJECT_INVITATION_REPOSITORY = 'PROJECT_INVITATION_REPOSITORY';
exports.USER_REPOSITORY = 'USER_REPOSITORY';
let ProjectInvitationModule = class ProjectInvitationModule {
};
exports.ProjectInvitationModule = ProjectInvitationModule;
exports.ProjectInvitationModule = ProjectInvitationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
        ],
        controllers: [
            project_invitation_controller_1.ProjectInvitationController
        ],
        providers: [
            send_project_invitation_use_case_1.SendProjectInvitationUseCase,
            accept_project_invitation_use_case_1.AcceptProjectInvitationUseCase,
            decline_project_invitation_use_case_1.DeclineProjectInvitationUseCase,
            prisma_service_1.PrismaService,
            email_service_1.EmailService,
            {
                provide: exports.PROJECT_INVITATION_REPOSITORY,
                useClass: prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
            },
            {
                provide: exports.USER_REPOSITORY,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
            prisma_user_repository_1.PrismaUserRepository,
        ],
        exports: [
            exports.PROJECT_INVITATION_REPOSITORY,
            send_project_invitation_use_case_1.SendProjectInvitationUseCase,
            accept_project_invitation_use_case_1.AcceptProjectInvitationUseCase,
            decline_project_invitation_use_case_1.DeclineProjectInvitationUseCase,
            prisma_project_invitation_repository_1.PrismaProjectInvitationRepository,
            email_service_1.EmailService,
        ],
    })
], ProjectInvitationModule);
//# sourceMappingURL=project-invitation.module.js.map