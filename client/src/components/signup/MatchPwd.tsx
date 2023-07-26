import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';

interface MatchPwdProps {
    stateMatchPwd: {
        matchPwd: string;
        validMatch: boolean;
        user: string; // what's its actual type?
    };
    fonctionUpdateMatchPwd: {
        updateMatchPwd: (value: string) => void;
    };
}

const MatchPwd: React.FC<MatchPwdProps> = ({ stateMatchPwd, fonctionUpdateMatchPwd }) => {

   const {matchPwd, validMatch, user} = stateMatchPwd;
   const {updateMatchPwd} = fonctionUpdateMatchPwd;

    return (
        // <>
        //         <label htmlFor="confirm_pwd">
        //             Confirm Password:
        //             <span className={validMatch && matchPwd ? "valid" : "hide"}>
        //                 <FontAwesomeIcon icon={faCheck} />
        //             </span>
        //             <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
        //                 <FontAwesomeIcon icon={faTimes} />
        //             </span>
        //         </label>
        //         <input
        //             type="password"
        //             id="confirm_pwd" //même valeur que le label
        //             onChange={(e) => updateMatchPwd(e.target.value)}
        //             required // champ requis
        //         />
        //         <p className={user && !validMatch ? "instructions" : "offscreen"} >
        //             <FontAwesomeIcon icon={faInfoCircle} />
        //             Must match the first password input field.
        //         </p>
        // </>


<>
<TextField
	required
	id="confirm_pwd"
	variant="standard"
	label="confirm password"
	autoComplete="off"
	onChange={(e) => updateMatchPwd(e.target.value)}
	value={matchPwd}
	error={!validMatch && matchPwd.length > 0}
	helperText={
		!validMatch && (
			<>	password not identical </>
		)
	}
/>
</>
    )
}

export default MatchPwd;