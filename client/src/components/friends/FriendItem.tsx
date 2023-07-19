import React from "react";
import { Friend } from '../friends/FriendList';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

interface FriendItemProps {
  friend: Friend;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const { name, icon } = friend;

  return (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
};

export default FriendItem;

