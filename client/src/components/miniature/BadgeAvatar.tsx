
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { useOnlineStatus } from '../../context/OnlineStatus';
import  { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import type {MiniAvatarPicture} from '../../utils/types'


export default function BadgeAvatar({ minAvatar }: { minAvatar: MiniAvatarPicture }) {

  const axiosPrivate = useAxiosPrivate();
  const onlineUsers = useOnlineStatus();

  // Define a state variable for isConnected
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Wrap the asynchronous code in an async function
    const fetchUserId = async () => {
      try {
        const id = await axiosPrivate.get(`/auth/userByNick/${minAvatar.name}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        // Check if the fetched user ID is in the onlineUsers array
        let connected = false;

		for (const online of onlineUsers.values()) {
			if (online.userId === id.data.id) {
        if(online.isOnline) {
          connected = true;
        }
        break;
			}
		}
		setIsConnected(connected);
        /// Update the isConnected state
      } catch (error) {
        console.error(error);
      }
    }

    // Call the async function to fetch the user ID
    fetchUserId();
  }, [minAvatar.name, axiosPrivate, onlineUsers]);

  const StyledBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
      backgroundColor: isConnected ? 'green' : 'grey',
      color: isConnected ? 'green' : 'grey',
      boxShadow: "0 0 0 2px white",
    },
  }));

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      invisible={!isConnected} // Set invisible to true if not connected
    >
      <Avatar alt={minAvatar.name} src={minAvatar.url} />
    </StyledBadge>
  );
}
