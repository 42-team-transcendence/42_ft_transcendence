import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io, {Socket} from "socket.io-client"
import {Box} from "@mui/material";
import MessageInput from "./MessageInput";
import MessageInConv from "./MessageInConv";
import Miniature from "../miniature/Miniature";

import tchoupi from '../../assets/tchoupi50x50.jpg'

import type {Message} from "../../utils/types"

function Conversation({chat, currentUser}:{chat:any, currentUser:any}) {
    const [chatSocket, setChatSocket] = useState<Socket>();
    // const [socketIsConnected, setSocketIsConnected] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // ******** TO DO: voir comment améliorer la fiabilité de ce bloc
    const recipientId = parseInt(useParams().userId || '');
    const recipient = (chat?.participants.find((e:any) => e.id === recipientId));

    //Update des messages displayed quand le chat est modifié
    useEffect(() => {
        const oldMessages: Message[] = chat.messages.map((msg:any) => {
            return {content: msg.message, senderId: msg.senderId, chatId: msg.chatId
        }});
        setMessages([...oldMessages]);
    }, [chat])

    //**************************************** SOCKETS *****************************************//

    //Création de la socket client
    useEffect(() => {
        const newChatSocket = io(
            //URL:port/namespace
            "http://localhost:3333/ns-chat", //dès que j'essaie de changer le port j'ai une erreur
            {
                path: "/chat",
                withCredentials: true,
                autoConnect: true,
                auth: {token: "//TODO : gérer les tokens d'authentification ici"},
                query: {"userId": currentUser.id}
            });
        console.log({newChatSocket});
        setChatSocket(newChatSocket)
    }, [setChatSocket])

    //On Connect : actions supplémentaires possibles à la connexion de la socket client
    useEffect(() => {
        function onConnect() {
            console.log("socket onConnect useEffect")
            // setSocketIsConnected(true);

            const userData = {
                userId : currentUser.id,
                socketId : chatSocket?.id
            }
            chatSocket?.emit("userData", userData)
        }
        chatSocket?.on('connect', onConnect);

      }, [chatSocket]);

    //Emission d'un message via le bouton MessageInput
    const send = (value:string) => {
        const payload : {content:string, to:number, from:number, chatId: number} = {
            content: value,
            to: recipientId,
            from: currentUser.id,
            chatId: chat.id
        }
        chatSocket?.emit("message", payload)
        //Pas besoin d'ajouter le message envoyé par soit-même puisquil est renvoyé par socket à toute la room
        // setMessages([...messages, {content: value, senderId: currentUser.id, chatId: chat.id}])
    }

    //Réception et stockage des messages par le client
    const messageListener = (message:Message) => {
        setMessages([...messages, message])
    }
    useEffect(() => {
        chatSocket?.on("message", messageListener); //if we have a socket, when we receive a message, adds function messageListener as listener
        return (() => { //cleanup function
            chatSocket?.off("message", messageListener);
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
                justifyContent: recipient? 'space-between': 'center',
                alignItems: 'center'
            }}
        >
            {recipient && messages ? (
            <>
                <Miniature nickname={recipient.nickname} minAvatar={{url: tchoupi, name:'Tchoupi'}}></Miniature>
                <Box sx={{ width:'100%'}}>
                    {messages?.map((msg, index) => {
                        return (
                            <MessageInConv
                                key={index}
                                content={msg.content}
                                sender={(chat?.participants.find((e:any) => e.id === msg.senderId))}
                                currentUser={currentUser}
                            ></MessageInConv>
                    )})}
                </Box>
                <Box>
                    <MessageInput send={send}></MessageInput>
                </Box>
            </>
            ) : <div>Select conversation</div>}
        </Box>
    )
}

export default Conversation
