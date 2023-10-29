import { useState, useEffect } from "react";
import io, {Socket} from "socket.io-client"
import {  useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import MessageInput from "./MessageInput";
import Miniature from "../../miniature/Miniature";
import GroupMiniature from "../../miniature/GroupMiniature";

// =============================================================================
// IMPORT TYPES ===============================================================
import type {AllChatInfo, ChannelMutedUsers, ChatAndParticipantsAndMsgs, Message, MessageInConv, MutedUser} from "../../../utils/types/chat"
import { User } from "../../../utils/types/user";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box, Button} from "@mui/material";
import { MessageLeft, MessageRight } from "./MessageStyle";
import '../../../styles/chat/Conversation.css'
import SettingsIcon from '@mui/icons-material/Settings';
import { useOnlineStatus } from "../../../context/OnlineStatus";


//TODO : problème quand on utilise la search bar directement depuis la page du chat, et qu'on join un nouveau canal, et qu'on envoie un message : il ne s'affiche pas (probleme de socket ?)
//TODO : mieux cleaner les sockets id côté server

// =============================================================================
// FUNCTION ====================================================================

//User-define typeguard : https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates
function isChannel(chat: ChatAndParticipantsAndMsgs | AllChatInfo): chat is AllChatInfo {
  return (chat as AllChatInfo).channelInfo !== undefined;
}

function Conversation({chat, currentUser, rerenderParent}:{
  chat: ChatAndParticipantsAndMsgs | AllChatInfo,
  currentUser: User,
  rerenderParent: () => void
}) {
    const [chatSocket, setChatSocket] = useState<Socket>();
    const [messages, setMessages] = useState<MessageInConv[]>([]);
    // const [recipientOnline, setRecipientOnline] = useState<boolean>(false);

    const navigate = useNavigate();
    // const onlineUsers = useOnlineStatus();

    const recipients = (chat?.participants.filter(e => e.id !== currentUser.id));

    //Update des messages displayed quand le chat est modifié
    useEffect(() => {
        const oldMessages: MessageInConv[] = chat.messages.map((msg) => {
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
    const messageListener = (message: MessageInConv) => {
        try {
          setMessages([...messages, message]);
          rerenderParent();
        } catch (e) {
          console.log(e);
        }
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

    const handleInviteToPlay = () => {
      send("Please play with me!");
      navigate(`/play`, {replace: false});
    }

    const goToPlayPage = () => {
      navigate(`/play`, {replace: false});
    }


    // useEffect(() => {
    //   if (isChat) {
    //     for (const u of onlineUsers.values()) {
    //       if (u.userId === recipients[0].id) {
    //         if(u.isOnline) {
    //           setRecipientOnline(true)
    //         }
    //         break;
    //       }
    //     }
    //   }
    // }, [isChat, onlineUsers])



    //Format Timestamp from msg stored in DB
    const formattedTimestamp = (date: Date | undefined) => {
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

    const isMute = (mutedUsers: MutedUser[], currentUser:User) => {
      //if element is found, currentUser is muted
      return mutedUsers.find((e) => {
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
            <div className="chan-top">
              { //CONVERSATION HEADER
                !isChannel(chat) ? ( //Si la conversation est un chat
                  recipients.length > 0 &&
                  <>
                    <Button onClick={handleInviteToPlay}>
                    {/* <Button disabled={!recipientOnline} onClick={handleInviteToPlay}> */}
                      {"Invite to play"}
                    </Button>
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
                  </>
                ) : (  //Si la conversation est un channel
                  <>
                    <div className="chan-left">
                      {chat.participants.length > 0 && <GroupMiniature participants={chat.participants}></GroupMiniature>}
                      {"channelInfo" in chat &&
                        <Button onClick={handleChannelTitleClick} endIcon={<SettingsIcon />}>
                          {chat.channelInfo.name}
                        </Button>}
                    </div>
                  </>
                )
              }
            </div>
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
                    const sender = chat?.participants.find((e) => e.id === msg.senderId);

                    const senderBlocked = currentUser.blocked.find((e) => e.id === msg.senderId);
                    return (
                      !senderBlocked && <MessageLeft
                        key={index}
                        message={
                          msg.content === "Please play with me!" ?
                          // msg.content === "Please play with me!" && recipientOnline ?
                          <Button onClick={goToPlayPage}>{msg.content}</Button>
                          :msg.content
                        }
                        timestamp={formattedTimestamp(msg.createdAt)}
                        sender={chat?.participants.find(e => e.id === msg.senderId)}
                    />);
                }
              })
            }
            </Box>
            <Box>
            {chat && isChannel(chat) && isMute(chat.channelInfo.mutedUsers, currentUser) && (
                `YOU ARE MUTED UNTIL ${formattedTimestamp(
                  chat.channelInfo.mutedUsers.find(e=>e.userId === currentUser.id)?.endsAt
                )}`
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
