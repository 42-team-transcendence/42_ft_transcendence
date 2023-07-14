import { useState, useEffect } from "react";
import io, {Socket} from "socket.io-client"
import MessageInput from "./MessageInput";
import Messages from "./Messages";

function Chat() {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const send = (value : string) => {
        socket?.emit("message", value)
    }

    useEffect(() => {
        const newSocket = io(
            "http://localhost:3333", //dès que j'essaie de changer le port j'ai une erreur
            {
                path: "/chat",
                withCredentials: true
            });
        setSocket(newSocket)
    }, [setSocket])

    const messageListener = ({message}:{message : string}) => {
        setMessages([...messages, message])
    }

    useEffect(() => {
        socket?.on("message", messageListener); //if we have a socket, when we receive a message, adds function messageListener as listener
        return (() => { //cleanup function
            socket?.off("message", messageListener);
        })
    }, [messageListener]);

    return (
        <>
            <h1>Chat</h1>
            <MessageInput send={send}></MessageInput>
            <Messages messages={messages}></Messages>
        </>
    )
}

export default Chat