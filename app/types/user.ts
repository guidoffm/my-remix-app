interface User {
    displayName: string;
    passwordHash: string;
    userId: string;
    email?: string;
    emailVerified: boolean;
    emailVerificationCode?: string;
    emailVerificationCodeCreatedAt?: number;
    pendingEmail?: string;
    lastLogin?: number;
};

interface UserWithKey extends User {
    userId: string;
};
