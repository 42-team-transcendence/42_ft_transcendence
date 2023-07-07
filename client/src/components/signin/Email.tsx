// import TextField from '@mui/material/TextField';

// function Email ({ stateEmail, fonctionUpdateEmail}) {

//   const {email}  = stateEmail;
//    const {updateEmail} = fonctionUpdateEmail;

//     // const emailRef = useRef();

//     //     useEffect(() => {
//     //     emailRef.current.focus();
//     // }, [])

//     return (
// 		<>
// 			<TextField
// 				required
// 				id="email"
// 				variant="standard"
// 				label="email"
// 				autoComplete="off"
// 				onChange={(e) => updateEmail(e.target.value)}
// 				value={email}
// 			/>
// 		</>
//     )
// }

// export default Email;

import TextField from '@mui/material/TextField';
import React, { ChangeEvent } from 'react';


interface EmailProps {
	stateEmail: {
	  email: string;
	};
	fonctionUpdateEmail: {
	  updateEmail: (email: string) => void;
	};
  }
  
  const Email: React.FC<EmailProps> = ({ stateEmail, fonctionUpdateEmail }) => {
	const { email } = stateEmail;
	const { updateEmail } = fonctionUpdateEmail;
  
	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
	  updateEmail(e.target.value);
	};
  
    return (
		<>
			<TextField
				required
				id="email"
				variant="standard"
				label="email"
				autoComplete="off"
				onChange={(e) => updateEmail(e.target.value)}
				value={email}
			/>
		</>
    )
}

export default Email;