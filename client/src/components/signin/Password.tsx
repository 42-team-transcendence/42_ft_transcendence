// import TextField from '@mui/material/TextField';

// function Password ({ statePwd, fonctionUpdatePwd }) {

//     const {pwd} = statePwd;
//     const {updatePwd} = fonctionUpdatePwd;

//     return (
// 		<>
// 			<TextField
// 				required
// 				id="password"
// 				type="password"
// 				variant="standard"
// 				label="password"
// 				autoComplete="off"
// 				onChange={(e) => updatePwd(e.target.value)}
// 				value={pwd}
// 			/>
// 		</>
//     )
// }

// export default Password;

import TextField from '@mui/material/TextField';
import { type } from 'os';
import React, { ChangeEvent } from 'react';

// export type PasswordProps = {
interface PasswordProps {
	statePwd: {
	  pwd: string;
	};
	fonctionUpdatePwd: {
	  updatePwd: (newValue: string) => void;
	};
  }
  
  const Password: React.FC<PasswordProps> = ({ statePwd, fonctionUpdatePwd }) => {
	const { pwd } = statePwd;
	const { updatePwd } = fonctionUpdatePwd;

	const handlePwdChange = (e: ChangeEvent<HTMLInputElement>) => {
		updatePwd(e.target.value);
	  };
	

    return (
		<>
			<TextField
				required
				id="password"
				type="password"
				variant="standard"
				label="password"
				autoComplete="off"
				onChange={(e) => updatePwd(e.target.value)}
				value={pwd}
			/>
		</>
    )
}

export default Password;