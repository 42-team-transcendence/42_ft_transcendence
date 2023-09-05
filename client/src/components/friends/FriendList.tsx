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
import Axios from "axios";

export interface Friend {
	name: string;
	icon: React.ReactNode; 
  }

const FriendList: React.FC = () => {
	const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    Axios.get("/users/friends").then((response) => {
      setFriends(response.data);
    });
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
