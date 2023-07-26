import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/system';


const CustomButtonWrapper = styled(Button)<ButtonProps>(({ theme }) => ({
	zIndex: 1,
	display: 'flex',
	// textTransform: 'lowercase !important',
	justifyContent: 'center',
	alignItems: 'center',
	color: 'white',
	font: 'Lato',
	textAlign: 'center',
	fontFamily: 'Lato',
	fontSize: '28px',
	fontWeight: 900,
	border: '2px black',
	marginTop: '10px',

}));

const CustomButton:React.FC<ButtonProps> = ({ children, onClick }) => {
	return (
	  <CustomButtonWrapper onClick={onClick}>
		<div
		  style={{
			background: '#FFF',
			width: '256px',
			height: '81px',
			border: '4px solid black',
			borderRadius: '10px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
		  }}
		>
			<div
				style={{
					backgroundColor: '#E586A8',
					width: '242px',
					height: '64px',
					border: '2px solid #000',
					borderRadius: '20px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{children}
		  	</div>
		</div>
	   </CustomButtonWrapper>
	);
  };
  

export default CustomButton;



