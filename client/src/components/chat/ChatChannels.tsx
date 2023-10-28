import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { redirect } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import Conversation from "./conversation/Conversation";
import ChatSidebar from "./chatSidebar/ChatSidebar";
import PageWrapper from "../navbar/pageWrapper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// =============================================================================
// IMPORT STYLES ===============================================================
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import '../../styles/chat/ChatChannel.css';

// =============================================================================
// IMPORT TYPES ===============================================================
import { AllChatInfo, Chat, ChatAndParticipantsAndMsgs } from "../../utils/types/chat";
import { User } from "../../utils/types/user";


// =============================================================================
// FUNCTION ====================================================================

export default function ChatChannels() {
	const axiosPrivate = useAxiosPrivate();

	const [myChats, setMyChats] = useState<AllChatInfo[]>();
	const [chatFound, setChatFound] = useState<boolean>(false)
	const [currentChat, setCurrentChat] = useState<ChatAndParticipantsAndMsgs | AllChatInfo>();
	const [currentUser, setCurrentUser] = useState<User>();
	const [showChatSidebar, setShowChatSidebar] = useState<boolean>(true);
	const [rerender, setRerender] = useState<boolean>(false);

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
                if (recipientId && currentUser && recipientId !== currentUser.id) { //ne s'actionne que si on a recipientId
                    const response = await axiosPrivate.post<ChatAndParticipantsAndMsgs>('/chats/findOrCreate',
                        JSON.stringify({'recipients': [recipientId]}), {
                            headers: { 'Content-Type': 'application/json'},
                            withCredentials: true
                        })
                    setCurrentChat(response.data);
                    setChatFound(true);
                } else if (channelId && currentUser) { //ne s'actionne que si on a un channelId
                    const response = await axiosPrivate.get<AllChatInfo>(`/chats/findById/${channelId}`, {
						headers: { 'Content-Type': 'application/json'},
						withCredentials: true
					})
					//Si currentUser ne fait pas parti du channel
					//ou est ban du channel, redirection hors du channel
					if (
						!response.data.participants.find(e => e.id === currentUser.id) ||
						response.data.channelInfo.bannedUsers.find(e => e.id === currentUser.id)
					)
						return redirect("/chat");
					setCurrentChat(response.data);
					setChatFound(true);
				}
            } catch (error:any) {
                console.log(error.response);
            }
        }
        findOrCreateChat(); //appel de la fonction
    }, [recipientId, currentUser, channelId, location.state, rerender])

	//GET ALL CHATS & CHANNELS DATA
    useEffect(() => {
		const findAllMyChats = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get<AllChatInfo[]>('/chats/findAllMyChats', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setMyChats(response.data);
			} catch (error:any) {
				console.log(error.response);
			}
		}
		findAllMyChats(); //appel de la fonction
    }, [chatFound, recipientId, currentUser, channelId, location.state, rerender])

    useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get<User>('/users/me', {
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

	const handleRerenderParent = () => {
		setRerender(!rerender)
	}

	return (
		<PageWrapper>
		  	<div className="chat-channel-container">
				{showChatSidebar && currentUser && myChats && (
				<ChatSidebar
					myChats={myChats}
					currentUser={currentUser}
					showChatSidebar={showChatSidebar}
					setShowChatSidebar={setShowChatSidebar}
				></ChatSidebar>
				)}
				<Box className="chat-box"></Box>
				<Box
					className={`chat-content ${showChatSidebar ? 'hidden' : ''}`}
					sx={{width:"100%", height: "100%"}}
				>
				{currentChat && !showChatSidebar && (
					<IconButton
						className="back-button"
						onClick={()=>setShowChatSidebar(true)}
					>
					<ArrowBackIcon />
					</IconButton>
				)}
				{currentChat ? (
					<Conversation
						chat={currentChat}
						currentUser={currentUser}
						rerenderParent={handleRerenderParent}
					></Conversation>
				) : (
					<p className="chat-select"> Select Chat</p>
				)}
				</Box>
		 	</div>
		</PageWrapper>
	  );
}
