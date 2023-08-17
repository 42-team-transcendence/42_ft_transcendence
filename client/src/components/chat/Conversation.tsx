import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io, {Socket} from "socket.io-client"


// =============================================================================
// IMPORT COMPONENTS ===========================================================
import MessageInput from "./MessageInput";
import MessageInConv from "./MessageInConv";
import Miniature from "../miniature/Miniature";
import tchoupi from '../../assets/tchoupi50x50.jpg'

// =============================================================================
// IMPORT TYPES ===============================================================
import type {Message} from "../../utils/types"

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box} from "@mui/material";
import { MessageLeft, MessageRight } from "./MessageStyle";
import '../../styles/chat/Conversation.css'



// =============================================================================
// FUNCTION ====================================================================

function Conversation({chat, currentUser}:{chat:any, currentUser:any}) {
    const [chatSocket, setChatSocket] = useState<Socket>();
    // const [socketIsConnected, setSocketIsConnected] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // ******** TO DO: A modifier quand on introduira les channels pour distinguer si la conv actuelle est un chat ou un channel
    let isChat;
    let recipients;
    if (1) {
        isChat = true;
        recipients = (chat?.participants.filter((e:any) => e.id != currentUser.id));
    }

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
    const send = (content:string) => {
        const payload : {content:string, senderId:number, chatId: number} = {
            content: content,
            senderId: currentUser.id,
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
		<div className="conversation-container">
		  	{isChat && recipients && messages ? (
			<>
				<Miniature
					miniatureUser={{
						nickname: recipients[0].nickname,
						id: recipients[0].id,
						minAvatar: { url: tchoupi, name: "Tchoupi" },
					}}
			 	></Miniature>
				<Box sx={{ width: "100%",  marginTop:"30px"}}>
					{messages?.map((msg, index) => {
					if (msg.senderId === currentUser.id) {
						// Display messages sent by the current user on the right
						return (
						<MessageRight
							key={index}
							message={msg.content}
							timestamp={'MM-DD 00H00'}
						/>
						);
					} else {
						// Display messages sent by others on the left
						const sender = chat?.participants.find(
						(e: any) => e.id === msg.senderId
						);
				
						return (
							<MessageLeft
								key={index}
								message={msg.content}
								timestamp={'MM-DD 00H00'}
								displayName={sender.nickname}
								sender={(chat?.participants.find((e:any) => e.id === msg.senderId))}
								// photoURL={/* Add the sender's photo URL here */}
							/>
						);
					}
					})}
				</Box>
				<Box>
					<MessageInput send={send}></MessageInput>
				</Box>
			</>
			) : (
				<div>Select conversation</div>
			)}
		</div>
	  );
}

export default Conversation
