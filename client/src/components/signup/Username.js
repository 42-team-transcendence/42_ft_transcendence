import React from "react";
import { useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import { makeStyles } from "@material-ui/core";

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