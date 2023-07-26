import { useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

interface EmailProps {
    stateEmail: {
        email: string;
        validEmail: boolean;
    };
    fonctionUpdateEmail: {
        updateEmail: (value: string) => void;
        updateValideEmail: (value: boolean) => void;
    };
}

const Email: React.FC<EmailProps> = ({ stateEmail, fonctionUpdateEmail }) => {

    const {email, validEmail} = stateEmail;
    const {updateEmail, updateValideEmail} = fonctionUpdateEmail;

    useEffect(() => {
        updateValideEmail(EMAIL_REGEX.test(email));
    }, [email])

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
				error={!validEmail && email.length > 0}
				helperText={
					!validEmail && email.length > 0 && (
						<>	unvalid email </>
					)
				}
		 	/>
		</>
	);
}

export default Email;