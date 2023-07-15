import { useState, useEffect } from "react";
import Chat from "./Chat";
import {Stack, Box, Container, Divider} from '@mui/material';
import ChatMiniature from "./ChatMiniature";


export default function ChatChannels() {

    return (
        <Stack
            sx={{width:'100vw', height:'100vh'}}
            spacing={0}
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Box p={10} sx={{backgroundColor : '#FF79AF', width:'58%', height:'100%'}}>
                <ChatMiniature notif={true}></ChatMiniature>
                <ChatMiniature notif={false}></ChatMiniature>
            </Box>
            <Box sx={{backgroundColor : 'white', width:'2%', height:'100%'}}></Box>
            <Box p={5} sx={{backgroundColor : '#FF8100', width:'40%', height:'100%'}}>
                <Chat></Chat>
            </Box>
        </Stack>
    )
}