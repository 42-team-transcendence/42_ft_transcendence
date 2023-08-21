import { useState, useEffect } from "react";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import ChatMiniature from "./ChatMiniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import { Box } from "@mui/material";
import "../../styles/chat/ChatSidebar.css"

// =============================================================================
// FUNCTION ====================================================================

// faire une version alternative de chat miniature pour les channels
export default function ChatSidebar({
  myChats,
  currentUser,
}: {
  myChats: any;
  currentUser: any;
}) {
  return (
	<Box
		p={10}
		className="responsive-chat-sidebar" // Add a class to the Box element
  	>
		{myChats &&
			myChats.map((chat: any, i: number) => {
				// Ensure chat and participants are defined before accessing properties
				if (chat && chat.participants && chat.participants.length > 0) {
					// Find first user id which is not mine
					const recipient = chat.participants.find(
					(e: any) => e && e.id !== currentUser.id
			);

			if (recipient && recipient.id) {
				return (
					<ChatMiniature
						key={i}
						notif={true}
						userId={recipient.id}
						nickname={recipient.nickname}
						lastMessage={
							chat.messages.length > 0
							? chat.messages[chat.messages.length - 1].message
							: ""
						}
					></ChatMiniature>
				);
			}
		}
          return null; // Return null if recipient or other necessary data is undefined
        })}
    </Box>
  );
}
