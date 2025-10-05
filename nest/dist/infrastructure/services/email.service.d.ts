import { ConfigService } from '@nestjs/config';
export interface SendInvitationEmailData {
    email: string;
    projectName: string;
    inviterName: string;
    acceptUrl: string;
    declineUrl: string;
    role: string;
}
export declare class EmailService {
    private readonly configService;
    constructor(configService: ConfigService);
    sendProjectInvitationEmail(data: SendInvitationEmailData): Promise<void>;
    private generateInvitationEmailTemplate;
}
