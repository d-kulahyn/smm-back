export declare class LoginResponseDto {
    success: boolean;
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: string;
        permissions: string[];
        isActive: boolean;
        emailVerifiedAt: string | null;
    };
}
