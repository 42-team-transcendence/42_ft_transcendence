import { useState, useEffect } from "react";
import {Box} from '@mui/material';
import ChatMiniature from "./ChatMiniature";


export default function ChatSidebar() {

    return (
        <Box p={10} sx={{backgroundColor : '#FF79AF', width:'58%', height:'100%'}}>
            <ChatMiniature notif={true}></ChatMiniature>
            <ChatMiniature notif={false}></ChatMiniature>
        </Box>
    )
}