import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io, {Socket} from "socket.io-client"
import {Box} from "@mui/material";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import Miniature from "../miniature/Miniature";

function Conversation({chat}:{chat:any}) {
    console.log({Conversation : chat})

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([...chat.messages]);

    const recipientId = parseInt(useParams().userId || '1'); //TO DO: A MODIFIER
    console.log("chat recipientId : " + recipientId);
    const recipient = chat?.participants.find((e:any) => e.id === recipientId)

    const send = (value : string) => {
        socket?.emit("message", value)
    }
    //Création et connexion de la socket client
    useEffect(() => {
        const newSocket = io(
            "http://localhost:3333", //dès que j'essaie de changer le port j'ai une erreur
            {
                path: "/chat",
                withCredentials: true
            });
        setSocket(newSocket)
        console.log(socket);
    }, [setSocket])

    //Réception et stockage des messages par le client
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
        <Box p={3}
            sx={{
                backgroundColor:'white',
                height:'100%',
                border: '2px solid black',
                borderRadius:'10px',
                display:'flex',
                flexDirection: 'column',
                justifyContent: 'space-between' 
                
            }}
        >
            <Miniature nickname={recipient.nickname}></Miniature>
            <Messages messages={messages}></Messages>
            <Box>
                <MessageInput send={send}></MessageInput>
            </Box>
        </Box>
    )
}

export default Conversation