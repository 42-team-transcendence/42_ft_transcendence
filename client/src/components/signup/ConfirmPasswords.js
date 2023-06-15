import React, { useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function ConfirmPassword({matchPwd, setMatchPwd, validMatch, setValidMatch, pwd}) {
    // const userRef = useRef();
    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])

    useEffect(() => {
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])


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
                // ref={userRef}
                onChange={(e) => setMatchPwd(e.target.value)}
                required // champ requis
    
            />
            <p className={ !validMatch ? "instructions" : "offscreen"} >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
            </p>
        </>
    )

}

export default ConfirmPassword;