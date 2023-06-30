import { useEffect } from "react";
import TextField from '@mui/material/TextField';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Password ({ statePwd, fonctionUpdatePwd }) {
    
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