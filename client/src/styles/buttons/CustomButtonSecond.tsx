import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	icon: ReactNode;
}

const CustomButtonSecond: React.FC<CustomButtonProps> = ({ text, icon, onClick }) => {
  return (
    <Button
      variant="contained"
      size="large"
      style={{
        backgroundColor: '#E586A8',
        border: '2px solid black',
        borderRadius: '10px',
        fontWeight: 900,
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center', // To align icon and text vertically
        justifyContent: 'center', // To center the content horizontally
      }}
      startIcon={icon}
	  onClick={onClick} 
    >
      {text}
    </Button>
  );
};

export default CustomButtonSecond;
