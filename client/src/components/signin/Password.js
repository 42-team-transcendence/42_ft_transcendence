import { useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Password({pwd, setPwd}) {

    return (
        <>
            <label htmlFor="password">
                Password:
            </label>
            <input
                type="password"
                id="password" //même valeur que le label
                // ref={userRef}
                onChange={(e) => setPwd(e.target.value)}
                required // champ requis
             
            />
        </>
    )


}

export default Password;