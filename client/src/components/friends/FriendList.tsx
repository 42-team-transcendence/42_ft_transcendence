import React, {useEffect, useState} from "react";
import PageWrapper from "../navbar/pageWrapper";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Miniature from "../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/GameHistory.css';
import '../../styles/Friends.css';
import { Box } from "@mui/material";


// =============================================================================
// INTERFACES ==================================================================
export interface Friend {
	name: string;
	icon: React.ReactNode; 
}

// =============================================================================
// FUNCTION ====================================================================
const FriendList: React.FC = () => {
	const axiosPrivate = useAxiosPrivate();
	const [currentUser, setCurrentUser] = useState<any>();
	const [friends, setFriends] = useState<any[]>();

	useEffect(() => {
		const getFriends = async () => {
			try {
				const response = await axiosPrivate.get('/users/me', {
					headers: { 'Content-Type': 'application/json'},
					withCredentials: true
			})
			console.log(response.data);
			console.log("friends", response.data.friend);

			setCurrentUser(response.data);
			setFriends(response.data.friend);
		}catch(error: any){
				console.log(error.response);
			}
		}
		getFriends();
  	}, []);
	
  return (
    <PageWrapper>
      	<Box
		sx={{
			display: "flex",
			flexDirection:"column",
			backgroundColor: "white",
			borderRadius: "20px",
			padding: "5vh",
			border: "2px solid black",
		}}>
			<h1 className="typo-game"> Friend List</h1>
			{ friends &&
				<ul> {
					friends.map((friend, index) => (
						<li key={index}>
							<Miniature miniatureUser={{
								nickname: friend.nickname,
								id: friend.id,
								minAvatar: {url: `http://localhost:3333/public/picture/${friend.nickname}`, name: friend.nickname}
							}}
							></Miniature>
						</li>
					))}
				</ul>
			}
		</Box>
    </PageWrapper>
  );
};

export default FriendList;
