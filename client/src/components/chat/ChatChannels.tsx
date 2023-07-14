import { useState, useEffect } from "react";
import Chat from "./Chat";
import {Stack, Box, Container} from '@mui/material';
import ChatMiniature from "./ChatMiniature";


export default function ChatChannels() {

    return (
        <Stack 
        // sx={{width:'1800px', height:'100%'}}
            spacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Box sx={{backgroundColor : '#FF79AF'}}>
                <ChatMiniature></ChatMiniature>
            </Box>
            <Box sx={{backgroundColor : '#FF8100'}}>
                <Chat></Chat>
            </Box>
        </Stack>
    )
}