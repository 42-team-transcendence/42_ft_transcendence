import { useEffect } from "react";
import TextField from '@mui/material/TextField';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface PwdProps{
	statePwd: {
        user: string; //might need to update the type of 'user' according to its actual type
        pwd: string;
        matchPwd: string;
        validPwd: boolean;
    };
    fonctionUpdatePwd: {
        updatePwd: (value: string) => void;
        updateValidePwd: (isValid: boolean) => void;
        updateValideMatch: (isValid: boolean) => void;
    };
}

const Password: React.FC<PwdProps> = ({ statePwd, fonctionUpdatePwd }) => {
    
    const {user, pwd, matchPwd, validPwd} = statePwd;
    const {updatePwd, updateValidePwd, updateValideMatch} = fonctionUpdatePwd;

    useEffect(() => {
        updateValidePwd(PWD_REGEX.test(pwd));
        updateValideMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    return (
		<>
			<TextField
				required
				id="pwd"
				variant="standard"
				label="password"
				autoComplete="off"
				type="password"
				onChange={(e) => updatePwd(e.target.value)}
				value={pwd}
				error={!validPwd && pwd.length > 0}
				helperText={
					!validPwd && pwd.length > 0 &&  (
						<>	error </>
					)
				}
			/>
		</>
    )
}

export default Password;