import { User } from "./user";

export const statuses: Status[] = [
	"PUBLIC",
	"PRIVATE",
	"PROTECTED"
]

export type Status = 'PUBLIC' | 'PRIVATE' | 'PROTECTED'

export type Chat = {
		id: number;
		createdAt: Date;
		updatedAt: Date;
		creatorId: number;
		participantsCount: number;
}

export type ChannelInfo = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    chatId: number;
    name: string;
    status: Status;
    password: string;
    ownerId: number;
}

export type ChannelMutedUsers = {
    createdAt: Date;
    updatedAt: Date;
    endsAt: Date;
    userId: number;
    channelId: number;
}

export type MutedUser = ChannelMutedUsers & {
	user: User
}

export type AllChannelInfo = ChannelInfo & {
	bannedUsers: User[],
	mutedUsers: MutedUser[],
	administrators: User[],
}

export type ChatAndParticipants = Chat & { participants : User[] }
export type ChatAndParticipantsAndMsgs = ChatAndParticipants & { messages: Message[]} 
export type AllChatInfo = ChatAndParticipantsAndMsgs & {channelInfo: AllChannelInfo}

export type MutedUsersAndChannelInfo = ChannelMutedUsers & {
	channel: {
		chat: {participants: User[]},
		administrators: User[],
		bannedUsers: User[]	
	}
}

export type Message = {
    id: number;
    createdAt: Date;
    message: string;
    chatId: number;
    senderId: number;
}

export type MessageInConv = {
    content: string,
    senderId: number,
    chatId: number,
	createdAt: Date
}

// export type Conversation = {
//     id: number,
//     creator: User,
//     recipient: User,
//     messages: Message[]
// }