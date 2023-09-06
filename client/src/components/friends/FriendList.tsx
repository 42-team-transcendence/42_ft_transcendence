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
import FriendItem from '../friends/FriendItem';
import { Container, Typography, List } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import '../../styles/Friends.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export interface Friend {
	name: string;
	icon: React.ReactNode; 
  }

  interface User {
	friend: Friend[];
	// Add other properties as needed
  }

const FriendList: React.FC = () => {
	const axiosPrivate = useAxiosPrivate();
	const [currentUser, setCurrentUser] = useState<any>();
	const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
	const getFriends = async () => {
		try {
			const response = await axiosPrivate.get('/users/me', {
				headers: { 'Content-Type': 'application/json'},
				withCredentials: true
		})
		setCurrentUser(response.data);
		console.log({response});
		setFriends(response.data.friend);
		console.log("friends", friends);
	}catch(error: any){
			console.log(error.response);
		}
	}
	getFriends();
  }, []);
	
  return (
    <PageWrapper>
      <Container>
		<h2>Friend List</h2>
		<div className="container">
			<List>
			{friends.map((friend, index) => (
				<FriendItem key={index} friend={friend} />
			))}
			</List>
		</div>
      </Container>
    </PageWrapper>
  );
};

export default FriendList;
