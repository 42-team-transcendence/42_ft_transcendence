import { useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

 function Username ({ stateUser, fonctionUpdate }) {
    
   const {user, validName, userFocus} = stateUser;
   const {updateUser, updateUserFocus, updateValideName} = fonctionUpdate;

    const userRef = useRef();
    
    useEffect(() => {
        userRef.current.focus();
    }, [])
    
    useEffect(() => {
        updateValideName(USER_REGEX.test(user));
    }, [user])
    
    return (
        <>
            <label htmlFor="username">
                Username:
                <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validName || !user ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="text"
                id="username" //même valeur que le label
                ref={userRef}
                autoComplete="off"
                onChange={(e) => updateUser(e.target.value)}
                value={user}
                required // champ requis
                onFocus={() => updateUserFocus(true)}
                onBlur={() => updateUserFocus(false)}
            />
            <p className={userFocus && user && !validName ? "instructions" : "offscreen"} >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.<br/>
                Must begin with a letter.<br/>
                Letters, numbers, underscores, hypens allowed
            </p>
        </>
    )
}

export default Username;