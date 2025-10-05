import { PrismaProjectInvitationRepository } from '../../infrastructure/repositories/prisma-project-invitation.repository';
export declare class DeclineProjectInvitationUseCase {
    private readonly invitationRepository;
    constructor(invitationRepository: PrismaProjectInvitationRepository);
    execute(token: string): Promise<{
        message: string;
    }>;
}
