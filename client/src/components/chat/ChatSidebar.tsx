import { useState, useEffect } from "react";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import ChatMiniature from "./ChatMiniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box} from '@mui/material';



// =============================================================================
// FUNCTION ====================================================================

//faire une version alternative de chat miniature pour les channels
export default function ChatSidebar(
    {myChats, currentUser}:{myChats:any,currentUser:any}
    ) {
    return (
        <Box p={10} sx={{backgroundColor : '#FF79AF', width:'58%', height:'100%'}}>
            {myChats.map((chat:any, i:number) => {
                //Find first user id which is not mine
                const recipient = chat?.participants.find((e:any) => e.id != currentUser.id)
                return (
                    <ChatMiniature
                        key={i}
                        notif={true}
                        userId={recipient?.id}
                        nickname={recipient?.nickname}
                        lastMessage={chat?.messages.length > 0 ? chat?.messages[chat?.messages.length - 1].message : ""}
                    ></ChatMiniature>
                )
            })}
        </Box>
    )
}
