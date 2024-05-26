export type User = {
    displayName: string;
    passwordHash: string;
    userId: string;
    email?: string;
    emailVerified: boolean;
    emailVerificationCode?: string;
    emailVerificationCodeCreatedAt?: number;
    pendingEmail?: string;
};
