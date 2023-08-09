import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io, {Socket} from "socket.io-client"
import {Box} from "@mui/material";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import Miniature from "../miniature/Miniature";

function Conversation({chat, currentUser}:{chat:any, currentUser:any}) {
    console.log({Conversation : chat})

    const [socket, setSocket] = useState<Socket>();
    const [socketIsConnected, setSocketIsConnected] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([...chat.messages]);
    


    // ******** TO DO: voir comment améliorer la fiabilité de ce bloc
    const recipientId = parseInt(useParams().userId || '');
    const recipient = (chat?.participants.find((e:any) => e.id === recipientId))
    console.log("chat recipientId : " + recipientId);


    //Création de la socket client
    useEffect(() => {
        const newSocket = io(
            "http://localhost:3333", //dès que j'essaie de changer le port j'ai une erreur
            {
                path: "/chat",
                withCredentials: true,
                autoConnect: true,
                auth: {token: "TODO : gérer les tokens d'authentification ici"},
                query: {"userId": currentUser.sub}
            });
        console.log({newSocket});
        setSocket(newSocket)
    }, [])

    //On Connect : actions supplémentaires possibles à la connexion de la socket client
    useEffect(() => {
        function onConnect() {
            console.log("socket onConnect useEffect")
            setSocketIsConnected(true);
            
            const userData = {
                userId : currentUser.sub,
                socketId : socket?.id
            }
            console.log({userData})

            socket?.emit("userData", userData)
        }
        socket?.on('connect', onConnect);

      }, [socket]);

    //Emission d'un message via le bouton MessageInput
    const send = (value:string) => {
        const payload = {
            message: value,
            to: recipientId,   
        }
        socket?.emit("message", payload)
    }

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
                justifyContent: recipient? 'space-between': 'center',
                alignItems: 'center'
            }}
        >
            {recipient? (
            <>
                <Miniature nickname={recipient.nickname}></Miniature>
                <Messages messages={messages}></Messages>
                <Box>
                    <MessageInput send={send}></MessageInput>
                </Box>
            </>
            ) : <div>Select conversation</div>}
        </Box>
    )
}

export default Conversation


// useEffect(() => { //Fetch chat data
//     const findOrCreateChat = async () => { //definition de la fonction
//         try {
//             const response = await axiosPrivate.post('/chats/findOrCreate',
//                 JSON.stringify({'recipients': [recipientId]}),
//                 {
//                     headers: { 'Content-Type': 'application/json'},
//                     withCredentials: true
//                 })
//             setChat(response.data);
//         } catch (error:any) {
//             console.log(error.response );
//         }
//     }
//     findOrCreateChat(); //appel de la fonction
// }, [recipientId])
