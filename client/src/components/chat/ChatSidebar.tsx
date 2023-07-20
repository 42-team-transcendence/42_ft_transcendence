import { useState, useEffect } from "react";
import {Box} from '@mui/material';
import ChatMiniature from "./ChatMiniature";


export default function ChatSidebar(    
    {notif, nickname, lastMessage}:
    {
        notif:boolean,
        nickname:string,
        lastMessage:string,
    }
) {

    return (
        <Box p={10} sx={{backgroundColor : '#FF79AF', width:'58%', height:'100%'}}>
            <ChatMiniature 
                notif={true} nickname={nickname} lastMessage={lastMessage}
            ></ChatMiniature>
            <ChatMiniature 
                notif={false} nickname={nickname} lastMessage={lastMessage}
            ></ChatMiniature>
        </Box>
    )
}