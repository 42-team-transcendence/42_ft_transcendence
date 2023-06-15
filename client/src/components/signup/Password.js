import { useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Password({pwd, setPwd, validPwd, setValidPwd, pwdFocus, setPwdFocus}) {
    // const userRef = useRef();
    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])


    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd])

    return (
        <>
            <label htmlFor="password">
                Password:
                <span className={validPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="password"
                id="password" //même valeur que le label
                // ref={userRef}
                onChange={(e) => setPwd(e.target.value)}
                required // champ requis
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
            />
            <p className={pwdFocus && !validPwd ? "instructions" : "offscreen"} >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br/>
                Must include uppercase and lowercase character, a number and a special character.<br/>
                Allowed special characters: !@#$%
            </p>

        
        
        </>
    )


}

export default Password;