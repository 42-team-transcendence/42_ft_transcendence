import { useState, useEffect } from "react";
import Chat from "./Chat";
import {Stack, Box, Container, Divider} from '@mui/material';
import ChatSidebar from "./ChatSidebar";
import PageWrapper from "../navbar/pageWrapper";


export default function ChatChannels() {

    return (
        <PageWrapper>
            <Stack
                sx={{width:'100vw', height:'100vh'}}
                spacing={0}
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <ChatSidebar></ChatSidebar>
                <Box sx={{backgroundColor : 'white', width:'2%', height:'100%'}}></Box>
                <Box p={5} sx={{backgroundColor : '#FF8100', width:'40%', height:'100%'}}>
                    <Chat></Chat>
                </Box>
            </Stack>
        </PageWrapper>
    )
}