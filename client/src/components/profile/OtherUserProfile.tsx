import { useState, useEffect } from "react"
import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import GameHistory from "./GameHistory";

import PageWrapper from "../navbar/pageWrapper";

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/profile/OtherUserProfile.css';
import '../../styles/profile/Profile.css';
import CustomButtonSecond from "../../styles/buttons/CustomButtonSecond";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PublicIcon from '@mui/icons-material/Public';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';


// =============================================================================
// INTERFACES ==================================================================
interface User {
	id: number;
	nickname: string;
	picture: string;
	level: string;
}

// =============================================================================
// FUNCTION ====================================================================

function OtherUserProfile() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

	const [user, setUser] = useState<User>();

  let { userId } = useParams();
  console.log(useParams());

  useEffect(() => {
		const getUser = async () => {
			try {
				const response = await axiosPrivate.get(`/users/${userId}`);
				console.log({user : response.data});
				if (!response.data) {
					navigate('/', {replace: false});
				}
				setUser({
					...response.data,
					picture:"https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg",
					level : "200"
					
				});
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getUser();
	}, [])

	const startPrivateMessage = () => {
		navigate(`/chat/${user?.id}`, {replace: false});
	}

  return (
	<PageWrapper>
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
						<p>Rank 2 | Lvl {user?.level}</p>
					</div>
				</div>
			
				<div className="column-other-user">
					<div className="row-other-user">
						<CustomButtonSecond
							icon={<ChatBubbleIcon />}
							text="Message"
							onClick={startPrivateMessage}
						/>

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
	</PageWrapper>
  );
}

export default OtherUserProfile;