export type User = {
    id : number,
    nickname : string,
    email : string,
    socket_id: number,
    picture: string,
    rank: string,
    level: string,
}

// export type CreateUserParams = {
//     email: string,
//     nickname: string,
//     password: string
// }

export type Message = {
    content: string,
    senderId: number,
    chatId: number,
	createdAt: Date
}

export type Conversation = {
    id: number,
    creator: User,
    recipient: User,
    messages: Message[]
}

export type MiniAvatarPicture = {
    url: string,
    name: string | undefined
}

export type MiniatureUser = {
    nickname: string | undefined,
    id: number | undefined,
    minAvatar: MiniAvatarPicture
}
