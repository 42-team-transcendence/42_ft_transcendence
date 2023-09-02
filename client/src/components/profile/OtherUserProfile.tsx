import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import GameHistory from "./GameHistory";
import { useOnlineStatus } from "../../context/OnlineStatus";
import PageWrapper from "../navbar/pageWrapper";

// =============================================================================
// IMPORT STYLES ===============================================================
import { Box, Button, Menu, MenuItem } from "@mui/material";
import '../../styles/profile/OtherUserProfile.css';
import '../../styles/profile/Profile.css';
import CustomButtonSecond from "../../styles/buttons/CustomButtonSecond";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PublicIcon from '@mui/icons-material/Public';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



// =============================================================================
// INTERFACES ==================================================================
interface User {
	id: number;
	nickname: string;
	picture: string;
	level: string;
	isOnline: boolean;
}

// =============================================================================
// FUNCTION ====================================================================

function OtherUserProfile() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

	const onlineUsers = useOnlineStatus();
	console.log({onlineUsers});
	
	const [user, setUser] = useState<User>();
	const [currentUser, setCurrentUser] = useState<any>();
	const [currentUserChans, setCurrentUserChans] = useState<any>();

	const [anchorChatMenu, setAnchorChatMenu] = useState<null | HTMLElement>(null);
    const openChatMenu = Boolean(anchorChatMenu);

	let { userId } = useParams();
  
  useEffect(() => {//GET USER DATA
		const getUser = async () => {
			try {
				const response = await axiosPrivate.get(`/users/${userId}`);
				if (!response.data) {
					navigate('/', {replace: false});
				}
				const isUserOnline = onlineUsers.includes(response.data.id);
				setUser({
					...response.data,
					picture:"https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg",
					level : "200",
					isOnline: isUserOnline,

				});
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getUser();
	}, [onlineUsers])

	useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => {
			try {
          const response = await axiosPrivate.get('/users/me', {
              headers: { 'Content-Type': 'application/json'},
              withCredentials: true
          })
          setCurrentUser(response.data);
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getCurrentUser();
    }, [])

    useEffect(() => {//GET ALL CHATS & CHANNELS DATA from current User
		const findAllMyPrivateChansOwned = async () => {
			try {
                const response = await axiosPrivate.get('/chats/findAllMyChats', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
				//filter only on channels where 1- currentUser is owner 2- channel is private 3-userProfile is not in this chan
                setCurrentUserChans(
					response.data.filter((chan:any)=>{
						return chan.channelInfo?.ownerId === currentUser.id && chan.channelInfo.status === "PRIVATE"
					})
				);
			} catch (error:any) {
				console.log(error.response );
			}
		}
		findAllMyPrivateChansOwned();
    }, [currentUser, user])

	const handleClickSendMsg = (event: React.MouseEvent<HTMLElement>) => {
		if (!currentUserChans) {
			startPrivateMessage()
			return;
		}
		setAnchorChatMenu(event.currentTarget)
	}

	const startPrivateMessage = () => {
		navigate('/chat', {state:{recipientId:user?.id}});
	}

	const handleInviteToChan = async (chan:any) => {
		if (!chan.participants.find((e:any) => e.id === user?.id)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/update/${chan.id}`,
                    JSON.stringify({
						newParticipant: user?.id,
					}), {
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
				)
				navigate('/chat', {state:{channelId:chan.id}});
            } catch (err: any) {
                console.log(err);
            }
		}
	}

  return (
	<PageWrapper>
		{user && 
			<div className="container-wrap-other">
				<div className="container-1">
					<div className="avatar">
						<div className="profile-picture-container">
							<img
							src={user?.picture}
							alt="Profile"
							className="profile-picture"
							/>
						</div>

						<div className="profile-info">
							<h1 className="name">{user?.nickname}</h1>
							<div className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}>
        						{user.isOnline ? 'Online' : 'Offline'}
							</div>				
							<p>Rank 2 | Lvl {user?.level}</p>
						</div>
					</div>

					<div className="column-other-user">
						<div className="row-other-user">
							<CustomButtonSecond
								icon={<ChatBubbleIcon />}
								text="Message"
								
								id="send_msg_button"
								aria-controls={openChatMenu ? 'send_msg_menu' : undefined}
								aria-haspopup="true"
								aria-expanded={openChatMenu ? 'true' : undefined}
								onClick={(event) => handleClickSendMsg(event)}
							/>
							<Menu
								id="send_msg_menu"
								anchorEl={anchorChatMenu}
								open={openChatMenu}
								onClose={() => setAnchorChatMenu(null)}
							>
								<MenuItem onClick={startPrivateMessage} disableRipple>
									<ChatBubbleIcon />
									Send private message
								</MenuItem>
								{currentUserChans && currentUserChans.map((chan:any, idx:number)=>{
									return (
										chan.participants.find((e:any)=>e.id === user.id) ? (
											<MenuItem key={idx+"_chan"} disableRipple>
												<ChatBubbleIcon />
												{`User already in channel ${chan.channelInfo.name}`}
											</MenuItem>
										) : (
											<MenuItem key={idx+"_chan"} onClick={() => handleInviteToChan(chan)} disableRipple>
												<ChatBubbleIcon />
												{`Invite to private channel ${chan.channelInfo.name}`}
											</MenuItem>
										)
									)
								})}
							</Menu>

							<CustomButtonSecond
								icon={<PublicIcon />}
								text="Invite to Play"
								onClick={startPrivateMessage}
							/>
						</div>

						<div className="row-other-user">
							<CustomButtonSecond
								icon={<PersonRemoveIcon />}
								text="Unfriend"
								onClick={startPrivateMessage}/>

							<CustomButtonSecond
								icon={<BlockIcon />}
								text="Block"
								onClick={startPrivateMessage} />
						</div>
					</div>
				</div>
				<GameHistory/>
			</div>
		}
	</PageWrapper>
  );
}

export default OtherUserProfile;
