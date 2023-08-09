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
    senderId: number
}

export type Conversation = {
    id: number,
    creator: User,
    recipient: User,
    messages: Message[]
}