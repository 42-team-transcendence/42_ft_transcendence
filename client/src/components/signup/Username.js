import { useEffect } from "react";
import TextField from '@mui/material/TextField';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

function Username ({ stateUser, fonctionUpdate }) {

   const {user, validName} = stateUser;
   const {updateUser, updateValideName} = fonctionUpdate;
    
    useEffect(() => {
        updateValideName(USER_REGEX.test(user));
    }, [user])
    
	return (
		<>
			<TextField
				required
				id="username"
				variant="standard"
				label="username"
				autoComplete="off"
				onChange={(e) => updateUser(e.target.value)}
				value={user}

				error={!validName && user.length > 0}
				helperText={
					!validName && user.length > 0 && (
						<>	username's too short </>
					)
				}
		 	/>
		</>
	);
}


export default Username;