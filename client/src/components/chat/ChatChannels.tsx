import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import Conversation from "./Conversation";
import ChatSidebar from "./ChatSidebar";
import PageWrapper from "../navbar/pageWrapper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// =============================================================================
// IMPORT STYLES ===============================================================
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import '../../styles/chat/ChatChannel.css';


// =============================================================================
// FUNCTION ====================================================================

export default function ChatChannels() {
	const axiosPrivate = useAxiosPrivate();

	const [myChats, setMyChats] = useState<any>();
	const [chatFound, setChatFound] = useState<boolean>(false)
	const [currentChat, setCurrentChat] = useState<any>();
	const [currentUser, setCurrentUser] = useState<any>();

    // Cas Chat en 1v1 : il faut checker le paramètre de l'URL
    //pour avoir l'id du user avec qui on veut chater
    let recipientId = parseInt(useParams().userId || ''); //vérifie si on a un userId dans l'URL
    console.log({recipientId});

    useEffect(() => { //If chat with recipientId does not exist, creates it
        const findOrCreateChat = async () => { //definition de la fonction
            try {
                if (recipientId && currentUser && recipientId != currentUser.id) { //ne s'actionne que si on a recipientId (que si un userId est dans l'URL)
                    const response = await axiosPrivate.post('/chats/findOrCreate',
                        JSON.stringify({'recipients': [recipientId]}), {
                            headers: { 'Content-Type': 'application/json'},
                            withCredentials: true
                        })
                    setCurrentChat(response.data);
                    setChatFound(true);
                }
            } catch (error:any) {
                console.log(error.response );
            }
        }
        findOrCreateChat(); //appel de la fonction
    }, [recipientId, currentUser])

    useEffect(() => { //Fetch chat data
		const findAllMyChats = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/chats/findAllMyChats', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setMyChats(response.data);
			} catch (error:any) {
				console.log(error.response );
			}
		}
		findAllMyChats(); //appel de la fonction
    }, [chatFound])

    useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/users/me', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setCurrentUser(response.data);
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getCurrentUser(); //appel de la fonction
    }, [])

	const [showChatSidebar, setShowChatSidebar] = useState(true);

	useEffect(() => {
	  const handleResize = () => {
		setShowChatSidebar(window.innerWidth > 768);
	  };

	  window.addEventListener("resize", handleResize);

	  // Call handleResize immediately to set initial state
	  handleResize();

	  return () => {
		window.removeEventListener("resize", handleResize);
	  };
	}, []);

	return (
		<PageWrapper>
		  	<div className="chat-channel-container">
				{showChatSidebar && currentUser && myChats && (
				<ChatSidebar
					myChats={myChats}
					currentUser={currentUser}
				></ChatSidebar>
				)}
				<Box className="chat-box"></Box>
				<Box
					className={`chat-content ${showChatSidebar ? 'hidden' : ''}`}
					sx={{

						width:"100%",
						height: "100%",
						// justifyContent : currentChat? 'space-between': 'center',

					}}
				>
				{currentChat && !showChatSidebar && (
					<IconButton
					className="back-button"
					onClick={() => {
						setShowChatSidebar(true);
					}}
					>
					<ArrowBackIcon />
					</IconButton>
				)}
				{currentChat ? (
					<Conversation
					chat={currentChat}
					currentUser={currentUser}
					></Conversation>
				) : (
					<p> Select Chat</p>
				)}
				</Box>
		 	</div>
		</PageWrapper>
	  );
}
