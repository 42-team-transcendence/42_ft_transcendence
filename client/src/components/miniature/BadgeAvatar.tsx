import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import tchoupi from '../../assets/tchoupi50x50.jpg'
import { useState } from 'react';

export default function BadgeAvatar() {
  const [isConnected, updateIsConnected] = useState<boolean>(true)
  const [invisible, setInvisible] = useState(false); //faire disparaître le rond de connexion

  // The "styled" function from @mui/material/styles is a utility provided by MUI
  // that allows you to create custom styled components easily. 
  // It is based on the concept of CSS-in-JS, where you define styles directly in your JS code.
  // The styled function takes two arguments: a component and a style definition function (propriétés CSS)
  const StyledBadge = styled(Badge)(() => (
  {
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
        invisible={invisible}
      >
        <Avatar alt="Tchoupi" src={tchoupi} />
      </StyledBadge>
  );
}
