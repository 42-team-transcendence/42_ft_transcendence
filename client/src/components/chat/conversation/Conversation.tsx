import { useState, useEffect } from "react";
import io, {Socket} from "socket.io-client"
import { useLocation, useNavigate } from "react-router-dom";


// =============================================================================
// IMPORT COMPONENTS ===========================================================
import MessageInput from "./MessageInput";
import Miniature from "../../miniature/Miniature";
import GroupMiniature from "../../miniature/GroupMiniature";

// =============================================================================
// IMPORT TYPES ===============================================================
import type {Message} from "../../../utils/types"

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box, Button} from "@mui/material";
import { MessageLeft, MessageRight } from "./MessageStyle";
import '../../../styles/chat/Conversation.css'
import SettingsIcon from '@mui/icons-material/Settings';


//TODO : problème quand on utilise la search bar directement depuis la page du chat, et qu'on join un nouveau canal, et qu'on envoie un message : il ne s'affiche pas (probleme de socket ?)
//TODO : mieux cleaner les sockets id côté server

// =============================================================================
// FUNCTION ====================================================================

function Conversation({chat, currentUser}:{chat:any, currentUser:any}) {
    const [chatSocket, setChatSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Message[]>([]);

    const navigate = useNavigate();

    let isChat = true;
    if (chat.channelInfo) //Check si c'est un chat ou un channel
      isChat = false;

    const recipients = (chat?.participants.filter((e:any) => e.id != currentUser.id));

    //Update des messages displayed quand le chat est modifié
    useEffect(() => {
        const oldMessages: Message[] = chat.messages.map((msg:any) => {
            return {content: msg.message, senderId: msg.senderId, chatId: msg.chatId, createdAt: msg.createdAt
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
                query: {"userId": currentUser.id},
            });
        setChatSocket(newChatSocket)
        
        return (() => {
            chatSocket?.disconnect();
        })
    }, [])

    //On Connect : actions supplémentaires possibles à la connexion de la socket client
    useEffect(() => {
        function onConnect() {
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

    //**************************************** AUTRES *****************************************//
    const handleChannelTitleClick = () => {
      navigate('/channelParams', {state: {chatId : chat.id}});
    }

    //Format Timestamp from msg stored in DB
    const formattedTimestamp = (date:Date) => {
      if (date)
        return new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(date))
      return "";
    }

const isMute = (mutedUsers:any, currentUser:any) => {
  //if element is found, currentUser is muted
  return mutedUsers.find((e:any) => {
    return (
      e.userId === currentUser.id
      && new Date(e.endsAt) > new Date())
  })
}

	return (
		<Box className="conversation"
		  p={5} sx={{ backgroundColor: '#FF8100', width: '100%', height: '100%' }}
		>
		  <div className="conversation-container">
        {recipients && messages ? (
          <>
            { //CONVERSATION HEADER
              isChat ? ( //Si la conversation est un chat
                recipients.length > 0 &&
                <Miniature
                  miniatureUser={{
                    nickname: recipients[0].nickname,
                    id: recipients[0].id,
                    minAvatar: {
                      url: `http://localhost:3333/public/picture/${recipients[0].nickname}`,
                      name: recipients[0].nickname
                    },
                  }}
                ></Miniature>
              ) : (  //Si la conversation est un channel
                <>
                  {chat.participants.length > 0 && <GroupMiniature participants={chat.participants}></GroupMiniature>}
                  {chat.channelInfo &&
                    <Button onClick={handleChannelTitleClick} endIcon={<SettingsIcon />}>
                      {chat.channelInfo.name}
                    </Button>}
                </>
              )
            }
            <Box sx={{ width: "100%", marginTop: "30px" }}> { //CONVERSATION BODY
              messages?.map((msg, index) => {
                if (msg.senderId === currentUser.id) {// Display messages sent by the current user on the right
                  return (
                    <MessageRight
                      key={index}
                      message={msg.content}
                      timestamp={formattedTimestamp(msg.createdAt)}/>
                  );
                } else {// Display messages sent by others on the left
                    const sender = chat?.participants.find((e: any) => e.id === msg.senderId);
                    const senderBlocked = currentUser.blocked.find((e: any) => e.id === msg.senderId);
                    return (
                      !senderBlocked && <MessageLeft
                        key={index}
                        message={msg.content}
                        timestamp={formattedTimestamp(msg.createdAt)}
                        displayName={sender?.nickname}
                        sender={chat?.participants.find((e: any) => e.id === msg.senderId)}
                    />);
                }
              })
            }
            </Box>
            <Box>
            {!isChat && isMute(chat?.channelInfo.mutedUsers, currentUser) && (
                `YOU ARE MUTED UNTIL ${formattedTimestamp(chat?.channelInfo.mutedUsers.find(
                  (e:any)=>e.userId === currentUser.id
                ).endsAt)}`
              )
            }
              <MessageInput send={send}></MessageInput>
            </Box>
          </>
        ) : (
			  <div>Select conversation</div>
			)}
		  </div>
		</Box>
	  );


}

export default Conversation
