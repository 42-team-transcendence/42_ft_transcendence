import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import ChatMiniature from "./ChatMiniature";
import ChannelMiniature from "./ChannelMiniature";
import CustomButton from "../../../styles/buttons/CustomButton";

// =============================================================================
// IMPORT STYLES ===============================================================
import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import "../../../styles/chat/ChatSidebar.css"
import { AllChatInfo } from "../../../utils/types/chat";
import { User } from "../../../utils/types/user";

// =============================================================================
// FUNCTION ====================================================================

// faire une version alternative de chat miniature pour les channels
export default function ChatSidebar({
  myChats,
  currentUser,
  showChatSidebar,
  setShowChatSidebar
}: {
  myChats: AllChatInfo[];
  currentUser: User;
  showChatSidebar: boolean,
  setShowChatSidebar: Dispatch<SetStateAction<boolean>>
}) {
	const navigate = useNavigate();

  return (
	<Box
		p={10}
		className="responsive-chat-sidebar" // Add a class to the Box element
  	>
		<CustomButton onClick={()=>navigate('/createChannel', { replace: false})}>
			<AddIcon />
			CREATE CHAN
		</CustomButton>

		{myChats && myChats.map((chat, i: number) => {
			// Ensure chat and participants are defined before accessing properties
			if (chat && chat.participants && chat.participants.length > 0) {
				if (!chat.channelInfo) { //CHAT
					// Find first user id which is not mine
					const recipient = chat?.participants?.find((e) => e.id !== currentUser.id);
					if (recipient?.id) {
						return (
							<ChatMiniature
								key={"chat"+i}
								notif={true}
								userId={recipient.id}
								nickname={recipient.nickname}
								lastMessage={
									chat.messages.length > 0 && !currentUser.blocked.find(e => e.id === recipient.id)
									  ? (chat.messages[chat.messages.length - 1].message.length > 20
										? chat.messages[chat.messages.length - 1].message.substring(0, 20) + "..."
										: chat.messages[chat.messages.length - 1].message)
									  : ""
								  }
								showChatSidebar={showChatSidebar}
								setShowChatSidebar={setShowChatSidebar}
							></ChatMiniature>
					);}
				} else { //CHANNEL
					return (
						<ChannelMiniature
							key={"channel"+i}
							notif={true}
							channelId={chat.id}
							participants={chat.participants}
							channelName={chat.channelInfo.name}
							lastMessage={
								chat.messages.length > 0 && !currentUser.blocked.find(
									(e)=>e.id === chat.messages[chat.messages.length - 1].senderId
								) ? (chat.messages[chat.messages.length - 1].message.length > 20
									? chat.messages[chat.messages.length - 1].message.substring(0, 20) + "..."
									: chat.messages[chat.messages.length - 1].message)
								: ""
							}
							showChatSidebar={showChatSidebar}
							setShowChatSidebar={setShowChatSidebar}
						></ChannelMiniature>
					)
				}
			}
        	return null; // Return null if recipient or other necessary data is undefined
        })}
    </Box>
  );
}
