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
exports.DeclineProjectInvitationUseCase = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const prisma_project_invitation_repository_1 = require("../../infrastructure/repositories/prisma-project-invitation.repository");
const client_1 = require("@prisma/client");
let DeclineProjectInvitationUseCase = class DeclineProjectInvitationUseCase {
    constructor(invitationRepository) {
        this.invitationRepository = invitationRepository;
    }
    async execute(token) {
        const invitation = await this.invitationRepository.findByToken(token);
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.status !== client_1.InvitationStatus.pending) {
            throw new common_1.BadRequestException('Invitation is no longer valid');
        }
        if (invitation.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invitation has expired');
        }
        await this.invitationRepository.updateStatus(token, client_1.InvitationStatus.declined);
        return { message: 'Invitation declined successfully' };
    }
};
exports.DeclineProjectInvitationUseCase = DeclineProjectInvitationUseCase;
exports.DeclineProjectInvitationUseCase = DeclineProjectInvitationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('PROJECT_INVITATION_REPOSITORY')),
    __metadata("design:paramtypes", [prisma_project_invitation_repository_1.PrismaProjectInvitationRepository])
], DeclineProjectInvitationUseCase);
//# sourceMappingURL=decline-project-invitation.use-case.js.map