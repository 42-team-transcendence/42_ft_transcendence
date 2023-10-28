export type UserSensitiveData = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    nickname: string;
    email: string;
    hash: string;
    hashedRt: string;
    secret: string;
    auth2fa: boolean;
    isOnline: boolean;
    rank: number;
    score: number;
    avatar: string;
}

export type UserNoSensitiveData = Omit<UserSensitiveData, "hash" | "hashedRt" | "secret" | "auth2fa">

export type User = UserNoSensitiveData & {
    blocked: UserNoSensitiveData[];
    blockedBy: UserNoSensitiveData[];
    friend: UserNoSensitiveData[];
    friendOf: UserNoSensitiveData[];
}