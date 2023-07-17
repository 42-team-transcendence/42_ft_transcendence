export type CreateChatParams = {
    authorId: number;
    recipientId: number;
    message: string;
}

export interface IChatService {
    createChat(chatParams : CreateChatParams);
}