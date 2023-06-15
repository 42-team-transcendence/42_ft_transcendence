import React, { useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function Email({email, setEmail}) {    
    return (
        <>
            <label htmlFor="email">
                Email:
            </label>
            <input
                type="text"
                id="email" //même valeur que le label
                // ref={userRef}
                // autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required // champ requis
            />
        </>
    )
}
export default Email;