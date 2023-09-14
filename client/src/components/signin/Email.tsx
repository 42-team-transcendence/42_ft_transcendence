import TextField from '@mui/material/TextField';

interface EmailProps {
	stateEmail: {
	  email: string;
	};
	fonctionUpdateEmail: {
	  updateEmail: (email: string) => void;
	};
  }

const Email: React.FC<EmailProps> = ({ stateEmail, fonctionUpdateEmail}) =>{

  	const {email}  = stateEmail;
	const {updateEmail} = fonctionUpdateEmail;

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