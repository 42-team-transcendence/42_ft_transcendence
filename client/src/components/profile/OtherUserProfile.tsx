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
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { PersonAdd } from "@mui/icons-material";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';



// =============================================================================
// INTERFACES ==================================================================
interface User {
	id: number;
	nickname: string;
	picture: string;
	isOnline: boolean;
	blockedBy: User[];
	blocked: User[];
	score: number;
	rank: number;
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
	const [userBlocked, setUserBlocked] = useState<boolean>(false);
	const [userBefriended, setUserAsFriend] = useState<boolean>(false);

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
					isOnline: isUserOnline,

				});
				console.log(response.data);
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
				if (response.data.blocked.find((e:any)=>e.id === user?.id))
					setUserBlocked(true);
				if(response.data.friend.find((e:any)=>e.id === user?.id))
					setUserAsFriend(true);
			} catch (error:any) {
				console.log(error.response);
			}
		}
		getCurrentUser();
    }, [user])

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

	const handleBlock = async () => {
		console.log("userBlocked", !userBlocked);
		try {
			if (user) {
				const response = await axiosPrivate.post(
					`users/block/${user.id}`,
					{block: !userBlocked}, {
						headers: {'Content-Type': 'application/json'},withCredentials: true
					}
				);
				setUserBlocked(!userBlocked);
			}
		} catch (err: any) {
			console.log(err.response);
		}
	}

	const handleAddFriend = async () => {
		console.log("userBefriended", !userBefriended);
		try {
		  if(user) {
			const response = await axiosPrivate.post(
				`users/add-friend/${user.id}`,
				{friend: !userBefriended},{
					headers: {'Content-Type': 'application/json'},withCredentials: true
				}
			);
			setUserAsFriend(!userBefriended);
		  }
		} catch (error) {
		  console.error('Error unfriending:', error);
		}
	  };



	// =============================================================================
	// BADGES ======================================================================

	const StyledBadge = styled(Badge)(() => ({
		'& .MuiBadge-badge': {
		  backgroundColor: user?.isOnline ? 'green' : 'grey',
		  color: user?.isOnline ? 'green' : 'grey',
		  boxShadow: "0 0 0 2px white",
		  width: "20px",
		  height: "20px",
		  borderRadius: 10
		},
	}));
	
	  
	return (
	<PageWrapper>
		{user && currentUser &&
			<div className="container-wrap-other">
				<div className="container-1">
					<div className="avatar">
						<div className="profile-picture-container">
							<StyledBadge
								overlap="circular"
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								variant="dot"
								invisible={!user.isOnline}
							>
								<Avatar sx={{ width: 150, height: 150, border: "2px solid black"  }} variant="square" alt={user.nickname} src={`http://localhost:3333/public/picture/${user.nickname}`} />
							</StyledBadge>
						</div>

						<div className="profile-info">
							<h1 className="name">{user?.nickname}</h1>
					
							<p className="rank">Rank {user.rank} | Lvl {user.score}</p>
						</div>
					</div>

					<div className="column-other-user">
						<div className="row-other-user">
							<CustomButtonSecond
								icon={<ChatBubbleIcon />}
								text="Message"
								disabled={currentUser.blockedBy.find((e:User)=>e.id === user.id)?true:false}
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
								icon={!userBefriended ? <PersonRemoveIcon />: <PersonAdd/>}
								text={!userBefriended ? "Friend" : "Unfriend"}
								onClick={handleAddFriend}/>

							<CustomButtonSecond
								icon={!userBlocked ? <BlockIcon />: <LockOpenIcon />}
								text={!userBlocked ? "Block": "Unblock"}
								onClick={handleBlock} />
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
