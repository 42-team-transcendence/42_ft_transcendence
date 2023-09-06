import React from "react";
import { Friend } from '../friends/FriendList';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

interface FriendItemProps {
  friend: Friend;
}

const FriendItem: React.FC<any> = ({ friend }) => {
  const { nickname, icon } = friend;

  return (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={nickname} />
    </ListItem>
  );
};

export default FriendItem;

