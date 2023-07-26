import TextField from '@mui/material/TextField';

interface PasswordProps {
	statePwd: {
	  pwd: string;
	};
	fonctionUpdatePwd: {
	  updatePwd: (password: string) => void;
	};
  }

const Password: React.FC<PasswordProps> = ({ statePwd, fonctionUpdatePwd }) => {

    const {pwd} = statePwd;
    const {updatePwd} = fonctionUpdatePwd;

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