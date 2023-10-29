import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import {  Box } from "@mui/material";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import Miniature from "../../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import  "../../../styles/chat/ChatMiniature.css";



// =============================================================================
// FUNCTION ====================================================================

export default function ChatMiniature({notif, nickname, lastMessage, userId, showChatSidebar, setShowChatSidebar}: {
    notif:boolean,
    nickname:string,
    lastMessage:string,
    userId:number,
    showChatSidebar: boolean,
    setShowChatSidebar: Dispatch<SetStateAction<boolean>>
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (window.innerWidth < 768)
            setShowChatSidebar(!showChatSidebar);
		navigate('/chat', {state: {recipientId: userId}});
    }

    return (
        <Box
            onClick={handleClick}
            sx={{
                backgroundColor: notif ? 'white' : '#00000021',
                border: notif ? '2px solid black' : 'none',
                borderRadius: '10px',
                	"&:hover": {
                    border: "1px solid #FF8100",
                    color: '#FF8100',
                },
            }}
            mt={3} pt={0} pb={0}
        >
			<div className="chat-miniature">
				<Miniature miniatureUser={{
					nickname: nickname,
					id: userId,
                    minAvatar: {
                        url: `http://localhost:3333/public/picture/${nickname}`,
                        name: nickname
                    }
				}}
				></Miniature>
				{/* margin left margin top */}
				<Box ml={0} mt={0}>
               		<div>{lastMessage}</div>
            	</Box>
			</div>
        </Box>
    )
}
