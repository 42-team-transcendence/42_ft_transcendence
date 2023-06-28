import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const MaterialUIForm = ({ handleSubmit, stateUser, fonctionUpdate, stateEmail, fonctionUpdateEmail, statePwd, fonctionUpdatePwd, stateMatchPwd, fonctionUpdateMatchPwd, validForm }) => {
  return (
	<form>
		<Box
			component="form"
			sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				
				'& .MuiTextField-root': { m: 1, width: '25ch' },
			}}
			noValidate
			autoComplete="off"
			onSubmit={handleSubmit}
		>
			<div>
				<TextField
				required
				id="standard-required"
				variant="standard"
				label="User"
				defaultValue=""
				value={stateUser.user}
				onChange={(e) => fonctionUpdate.updateUser(e.target.value)}
				/>
				{/* Add more TextField components as needed */}
				<TextField
				required
				id="standard-required"
				variant="standard"
				label="Email"
				defaultValue=""
				value={stateEmail.email}
				onChange={(e) => fonctionUpdateEmail.updateEmail(e.target.value)}
				/>
				{/* Add more TextField components as needed */}
				<TextField
				required
				id="outlined-password"
				variant="standard"
				label="Password"
				type="password"
				autoComplete="current-password"
				defaultValue=""
				value={statePwd.pwd}
				onChange={(e) => fonctionUpdatePwd.updatePwd(e.target.value)}
				/>
				{/* Add more TextField components as needed */}
				<TextField
				required
				id="outlined-match-password"
				variant="standard"
				label="Confirm Password"
				type="password"
				autoComplete="current-password"
				defaultValue=""
				value={stateMatchPwd.matchPwd}
				onChange={(e) => fonctionUpdateMatchPwd.updateMatchPwd(e.target.value)}
				/>
				{/* Add more TextField components as needed */}
			</div>
			<button disabled={!validForm}>Sign Up</button>
		</Box>
	</form>
  );
};






export default MaterialUIForm;
