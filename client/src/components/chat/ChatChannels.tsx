import { useState, useEffect } from "react";
import Conversation from "./Conversation";
import {Stack, Box, Container, Divider} from '@mui/material';
import ChatSidebar from "./ChatSidebar";
import PageWrapper from "../navbar/pageWrapper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";


export default function ChatChannels() {
    const axiosPrivate = useAxiosPrivate();

    const [myChats, setMyChats] = useState<any>();

    const recipientId = parseInt(useParams().userId || '1'); //TO DO: A MODIFIER pour avoir qqch de plus solide
    console.log("chat recipientId : " + recipientId);

    useEffect(() => { //Fetch chat data
		const findAllMyChats = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/chats/findAllMyChats',
                    {
                        headers: { 'Content-Type': 'application/json'},
                        withCredentials: true
                })
                setMyChats(response.data);
                console.log({myChats : response.data});
			} catch (error:any) {
				console.log(error.response );
			}
		}
		findAllMyChats(); //appel de la fonction
    }, [])

    return (
        <PageWrapper>
            <Stack
                sx={{width:'100vw', height:'100vh'}}
                spacing={0}
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                { myChats ? ( // Conditionally render the components only when recipient is available
                <>
                    <ChatSidebar myChats={myChats}></ChatSidebar>
                    <Box sx={{backgroundColor : 'white', width:'2%', height:'100%'}}></Box>
                    <Box p={5} sx={{backgroundColor : '#FF8100', width:'40%', height:'100%'}}>
                        {/* //TO DO: remplacer par la bonne valeur*/}
                        <Conversation chat={myChats[0]}></Conversation>
                    </Box>
                </>
                ): <p> Loading Recipient</p>}
            </Stack>
        </PageWrapper>
    )
}


// const [recipient, setRecipient] = useState<any>();
// const [messages, setMessages] = useState<string[]>([]);

    // const renderChatInfos = () => {
    //     setMessages(chat?.messages);
    //     setRecipient(chat?.participants.find((e:any) => e.id === recipientId));
    // }

    // useEffect(() => {// When chat state is updated, render chat infos
    //     if (chat) {
    //         renderChatInfos(); // Call the function when chat is updated
    //         console.log({ chatInUseEffect: chat }); // Now the chat state will be updated
    //     }
    // }, [chat]);


// useEffect(() => { //Fetch chat data
//     const findOrCreateChat = async () => { //definition de la fonction
//         try {
//             const response = await axiosPrivate.post('/chats/findOrCreate',
//                 JSON.stringify({'recipients': [recipientId]}),
//                 {
//                     headers: { 'Content-Type': 'application/json'},
//                     withCredentials: true
//                 })
//             setChat(response.data);
//         } catch (error:any) {
//             console.log(error.response );
//         }
//     }
//     findOrCreateChat(); //appel de la fonction
// }, [recipientId])