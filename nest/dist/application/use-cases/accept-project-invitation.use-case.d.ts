import { PrismaProjectInvitationRepository } from '../../infrastructure/repositories/prisma-project-invitation.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AcceptProjectInvitationUseCaseDto } from '../../infrastructure/api/dto/project-invitation.dto';
export declare class AcceptProjectInvitationUseCase {
    private readonly invitationRepository;
    private readonly prisma;
    constructor(invitationRepository: PrismaProjectInvitationRepository, prisma: PrismaService);
    execute(dto: AcceptProjectInvitationUseCaseDto): Promise<any>;
}
