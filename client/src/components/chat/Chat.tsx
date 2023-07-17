import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io, {Socket} from "socket.io-client"
import {Box} from "@mui/material";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import Miniature from "../miniature/Miniature";
import PageWrapper from "../navbar/pageWrapper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface User {
	id: number;
	nickname: string;
    socket_id: number;
}

function Chat() {
    const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);
    const [otherUser, setOtherUser] = useState<User>();

    const { userId } = useParams();
    console.log("chat userId : " + userId);

    //récupération des données de l'autre user du chat
    useEffect(() => {
		const getUser = async () => { //definition de la fonction
			try {
				const response = await axiosPrivate.get(`/users/${userId}`);
				console.log({user : response.data});
				if (!response.data) {
					navigate('/', {replace: false});
				}
				setOtherUser({
					...response.data,					
				});
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getUser(); //appel de la fonction
	}, [])

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
		<PageWrapper>
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
				<Miniature></Miniature>
				<Messages messages={messages}></Messages>
				<Box>
					<MessageInput send={send}></MessageInput>
				</Box>
			</Box>
		</PageWrapper>
    )
}

export default Chat