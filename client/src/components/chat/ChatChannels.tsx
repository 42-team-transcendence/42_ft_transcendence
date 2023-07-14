import { useState, useEffect } from "react";
import Chat from "./Chat";
import {Stack, Box, Container} from '@mui/material';
import ChatMiniature from "./ChatMiniature";


export default function ChatChannels() {

    return (
        <Stack
            spacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Container>
                <h1>Chat & Channels</h1>
                <ChatMiniature></ChatMiniature>
            </Container>
            <Container>
                <Chat></Chat>
            </Container>
        </Stack>
    )
}