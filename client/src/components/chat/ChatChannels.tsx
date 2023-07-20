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
    const [chatFound, setChatFound] = useState<boolean>(false)
    const [currentChat, setCurrentChat] = useState<any>();
    const [currentUser, setCurrentUser] = useState<any>();

    // Cas Chat en 1v1 : il faut checker le paramètre de l'URL
    //pour avoir l'id du user avec qui on veut chater 
    let recipientId = parseInt(useParams().userId || ''); //vérifie si on a un userId dans l'URL
    console.log({recipientId});

    useEffect(() => { //If chat with recipientId does not exist, creates it
        const findOrCreateChat = async () => { //definition de la fonction
            try {
                if (recipientId && currentUser && recipientId != currentUser.sub) { //ne s'actionne que si on a recipientId (que si un userId est dans l'URL)
                    const response = await axiosPrivate.post('/chats/findOrCreate',
                        JSON.stringify({'recipients': [recipientId]}), {
                            headers: { 'Content-Type': 'application/json'},
                            withCredentials: true
                        })
                    console.log(response.data);
                    setCurrentChat(response.data);
                    setChatFound(true);
                }
            } catch (error:any) {
                console.log(error.response );
            }
        }
        findOrCreateChat(); //appel de la fonction
    }, [recipientId, currentUser])

    useEffect(() => { //Fetch chat data
		const findAllMyChats = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/chats/findAllMyChats', {
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
    }, [chatFound])

    useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/users/me', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setCurrentUser(response.data);
                console.log({currentUser : response.data});
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getCurrentUser(); //appel de la fonction
    }, [])


    return (
        <PageWrapper>
            <Stack
                sx={{width:'100vw', height:'100vh'}}
                spacing={0}
                direction="row"
                justifyContent='center'
                alignItems='center'
            >
                { myChats && currentUser ? ( // Conditionally render the components only when recipient is available
                <>
                    <ChatSidebar 
                        myChats={myChats}
                        currentUser={currentUser}
                    ></ChatSidebar>
                    <Box sx={{backgroundColor : 'white', width:'2%', height:'100%'}}></Box>
                    <Box p={5} sx={{
                        backgroundColor : '#FF8100', width:'40%', height:'100%',
                        justifyContent : currentChat? 'space-between': 'center',
                        alignItems : currentChat? 'space-between': 'center',
                        display : 'flex'
                    }}>
                        { currentChat ? (
                            <Conversation chat={currentChat}></Conversation>
                        ) : <p> Select Chat</p>}
                    </Box>
                </>
                ): <p> Loading Chats</p>}
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
