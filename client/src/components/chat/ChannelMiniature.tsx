import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box, AvatarGroup, Avatar } from "@mui/material";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import Miniature from "../miniature/Miniature";
import tchoupi from '../../assets/tchoupi50x50.jpg'

// =============================================================================
// IMPORT STYLES ===============================================================
import { CenterFocusStrong } from "@mui/icons-material";
import  "../../styles/chat/ChatMiniature.css";
import BadgeAvatar from "../miniature/BadgeAvatar";



// =============================================================================
// FUNCTION ====================================================================

export default function ChannelMiniature({notif, channelName, lastMessage, userId, participants}: {
    notif:boolean,
    channelName:string,
    lastMessage:string,
    userId:number,
    participants:any
}) {
    const navigate = useNavigate();
    const location = useLocation();
    console.log({participants});
    return (

        <Box
            onClick={() => {
                //TODO : change/toggle hidden class here to make conversation appear
                navigate(`/chat/${userId}`, {replace: false})
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
                    <AvatarGroup max={4}>
                        {participants.map(()=>{
                            return (
                                <BadgeAvatar minAvatar={{url: tchoupi, name:'Tchoupi'}}></BadgeAvatar>
                            )
                        })}
                    </AvatarGroup>
                    <span>{channelName}</span>
                    <Box ml={0} mt={0}><div>{lastMessage}</div></Box>
                </div>
            }
        </Box>
    )
}
