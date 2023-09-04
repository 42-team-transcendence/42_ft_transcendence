import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box, AvatarGroup, Avatar } from "@mui/material";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import tchoupi from '../../../assets/tchoupi50x50.jpg'

// =============================================================================
// IMPORT STYLES ===============================================================
import { CenterFocusStrong } from "@mui/icons-material";
import  "../../../styles/chat/ChatMiniature.css";
import BadgeAvatar from "../../miniature/BadgeAvatar";
import GroupMiniature from "../../miniature/GroupMiniature";



// =============================================================================
// FUNCTION ====================================================================

export default function ChannelMiniature({notif, channelName, lastMessage, channelId, participants, showChatSidebar, setShowChatSidebar}: {
    notif:boolean,
    channelName:string,
    lastMessage:string,
    channelId:number,
    participants:any,
    showChatSidebar:any,
    setShowChatSidebar:any,
}) {
    const navigate = useNavigate();

    return (

        <Box
            onClick={() => {
                if (window.innerWidth < 768)
                    setShowChatSidebar(!showChatSidebar);
                navigate('/chat', {state: {channelId}});
            }}
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
            {participants &&
                <div className="chat-miniature">
                    <GroupMiniature participants={participants}></GroupMiniature>
                    <span>{"CHANNEL " + channelName}</span>
                    <Box ml={0} mt={0}><div>{lastMessage}</div></Box>
                </div>
            }
        </Box>
    )
}