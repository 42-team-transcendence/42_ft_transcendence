// const FriendList:React.FC = () => {
// 	return (
// 		<PageWrapper>
// 			<div>
// 				<h2>Friend List</h2>
// 				{friends.map((friend, index) => (
//         <FriendItem key={index} friend={friend} />
//       ))}
// 			</div>
// 		</PageWrapper>
// 	)
//   }


import React, {useEffect, useState} from "react";
import PageWrapper from "../navbar/pageWrapper";

import { Container, Typography, List } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import '../../styles/Friends.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Miniature from "../miniature/Miniature";

export interface Friend {
	name: string;
	icon: React.ReactNode; 
  }

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
      <Container>
	  {/* <Typography variant="h2" className="friend-list-title"> */}
		<h2>Friend List</h2>
		{/* </Typography> */}
		<div className="container">
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
		</div>
      </Container>
    </PageWrapper>
  );
};

export default FriendList;
