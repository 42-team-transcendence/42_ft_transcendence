import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Miniature from "../miniature/Miniature";

import tchoupi from '../../assets/tchoupi50x50.jpg'



export default function ChatMiniature(
    {notif, nickname, lastMessage, userId}:{
        notif:boolean,
        nickname:string,
        lastMessage:string,
        userId:number
    }) {
        const navigate = useNavigate();
        const location = useLocation();

    return (
        <Box 
            onClick={() => navigate(`/chat/${userId}`, {replace: false})}
            sx={{
                backgroundColor: notif ? 'white' : '#00000021',
                border: notif ? '2px solid black' : 'none',
                borderRadius: '10px',
                "&:hover": {
                    border: "1px solid #FF8100",
                    color: '#FF8100',
                },
            }}
            mt={3} pt={1} pb={1}
        >
            <Miniature nickname={nickname} minAvatar={{url: tchoupi, name:'Tchoupi'}}></Miniature>
            {/* margin left margin top */}
            <Box ml={0} mt={0}>
                <div>{lastMessage}</div>
            </Box>
        </Box>
    )
}