import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import {  Box } from "@mui/material";

// =============================================================================
// IMPORT STYLES ===============================================================
import  "../../../styles/chat/ChatMiniature.css";
import GroupMiniature from "../../miniature/GroupMiniature";
import { User } from "../../../utils/types/user";



// =============================================================================
// FUNCTION ====================================================================

export default function ChannelMiniature({
    notif, channelName, lastMessage, channelId, participants, showChatSidebar, setShowChatSidebar
}: {
    notif: boolean,
    channelName: string,
    lastMessage: string,
    channelId: number,
    participants: User[],
    showChatSidebar: boolean,
    setShowChatSidebar: Dispatch<SetStateAction<boolean>>
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
                    <div className="chan-miniature">
                        <span className="chan-title">{"CHANNEL " + channelName}</span>
                        <Box ml={0} mt={0}><div>{lastMessage}</div></Box>
                    </div>
                </div>
            }
        </Box>
    )
}
