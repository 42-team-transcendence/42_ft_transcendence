import { useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MatchPwd ({ stateMatchPwd, fonctionUpdateMatchPwd }) {

   const {matchPwd, validMatch, matchFocus, user} = stateMatchPwd;
   const {updateMatchPwd, updateMatchPwdFocus} = fonctionUpdateMatchPwd;

    return (
        <>
                <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <span className={validMatch && matchPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    type="password"
                    id="confirm_pwd" //même valeur que le label
                    onChange={(e) => updateMatchPwd(e.target.value)}
                    required // champ requis
                    onFocus={() => updateMatchPwdFocus(true)}
                    onBlur={() => updateMatchPwdFocus(false)}
                />
                <p className={matchFocus && user && !validMatch ? "instructions" : "offscreen"} >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>
        </>
    )
}

export default MatchPwd;