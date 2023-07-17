import { useState, useEffect } from "react"
import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import '../../styles/Profile.css';
import PageWrapper from "../navbar/pageWrapper";

interface User {
	id: number;
	nickname: string;
	picture: string;
	level: string;
}

function OtherUserProfile() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

	const [user, setUser] = useState<User>();

  let { userId } = useParams();
  console.log(useParams());

  useEffect(() => {
		const getUser = async () => { //definition de la fonction
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
		getUser(); //appel de la fonction
	}, [])

	const startPrivateMessage = () => {
		navigate(`/chat/${user?.id}`, {replace: false});
	}

  return (
	<PageWrapper>
		<Box>
			<div className="profile-container">
				<div className="profile-picture-container">
					<img
					src={user?.picture}
					alt="Profile"
					className="profile-picture"
					/>
				</div>
				<div className="profile-info">
					<h2>Profile</h2>
					<h3>{user?.nickname}</h3>
					<p>Rank 2 | Lvl {user?.level}</p>
					<h4>Email</h4>
					<h4>Password</h4>
					<h4>Double factors</h4>
					{/* Add other profile information here */}
				</div>
			</div>
			<Box>
				<Button variant="contained"
					onClick={() => startPrivateMessage()}
				>Message
				</Button>
			</Box>
		</Box>
	</PageWrapper>
  );
}

export default OtherUserProfile;