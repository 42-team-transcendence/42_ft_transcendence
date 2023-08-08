import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


import '../../styles/Profile.css';

interface UserData {
  nickname: string;
}

interface UserProfileProps {
  onNicknameChange: (nickname: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNicknameChange }) => {
	const [nickname, setNick] = useState<string>('');
  
	const axiosPrivate = useAxiosPrivate();
  
	useEffect(() => {
	  fetchNick();
	}, []);
  
	const fetchNick = async () => {
	  try {
		const response = await axiosPrivate.get<UserData>("/users/nickname");
		if (response.status === 200) {
		  const { nickname } = response.data;
		  setNick(nickname);
		}
	  } catch (error) {
		console.error("Error fetching nickname:", error);
	  }
	};
  
	console.log(`NICK = ${nickname}`);
  
	return (
	  <div className="name">{nickname}</div> 
	);
  };
  
export default UserProfile;
