export type User = {
    displayName: string;
    passwordHash: string;
    userId: string;
    email: string;
    emailVerified: boolean;
    pendingEmail: string;
};
