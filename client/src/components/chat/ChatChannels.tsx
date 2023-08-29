import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";

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
	const navigate = useNavigate();

	const [myChats, setMyChats] = useState<any>();
	const [chatFound, setChatFound] = useState<boolean>(false)
	const [currentChat, setCurrentChat] = useState<any>();
	const [currentUser, setCurrentUser] = useState<any>();
	const [showChatSidebar, setShowChatSidebar] = useState(true);

	const location = useLocation(); //sert a recuperer le state passer avec useNavigate()
	let recipientId:number | null = null;
	let channelId: number|null = null;
	if (location.state && location.state.recipientId) // Cas pour affichage du chat
		recipientId = location.state.recipientId;
	else if (location.state && location.state.channelId) //Cas pour affichage du channel
		channelId = location.state.channelId;

	//GET CURRENT CHAT/CHANNEL CONVERSATION
    useEffect(() => { //If chat with recipientId does not exist, creates it
        const findOrCreateChat = async () => { //definition de la fonction
            try {
                if (recipientId && currentUser && recipientId != currentUser.id) { //ne s'actionne que si on a recipientId
                    const response = await axiosPrivate.post('/chats/findOrCreate',
                        JSON.stringify({'recipients': [recipientId]}), {
                            headers: { 'Content-Type': 'application/json'},
                            withCredentials: true
                        })
                    setCurrentChat(response.data);
                    setChatFound(true);
                } else if (channelId && currentUser) { //ne s'actionne que si on a un channelId
                    const response = await axiosPrivate.get(`/chats/findById/${channelId}`, {
						headers: { 'Content-Type': 'application/json'},
						withCredentials: true
					})
					console.log("bannedUsers", response.data.channelInfo.bannedUsers)
					//Si currentUser ne fait pas parti du channel 
					//ou est ban du channel, redirection hors du channel
					if (
						!response.data.participants.find((e:any)=>e.id === currentUser.id) ||
						response.data.channelInfo.bannedUsers.find((e:any)=>e.id === currentUser.id)
					)
						return redirect("/chat");
					setCurrentChat(response.data);
					setChatFound(true);
				}
            } catch (error:any) {
                console.log(error.response );
            }
        }
        findOrCreateChat(); //appel de la fonction
    }, [recipientId, currentUser, channelId])

	//GET ALL CHATS & CHANNELS DATA
    useEffect(() => {
		const findAllMyChats = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/chats/findAllMyChats', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setMyChats(response.data);
			} catch (error:any) {
				console.log(error.response);
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

	useEffect(() => { //Style : resize window
	  const handleResize = () => {
		setShowChatSidebar(window.innerWidth > 768);
	  };

	  window.addEventListener("resize", handleResize);
	  handleResize(); // Call handleResize immediately to set initial state
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
