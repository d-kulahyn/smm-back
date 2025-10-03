import { UserRepository } from '../../domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
export interface SocialAuthCommand {
    accessToken: string;
    provider: string;
}
export declare class SocialAuthUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    execute(command: SocialAuthCommand): Promise<string>;
    private validateSocialToken;
}
