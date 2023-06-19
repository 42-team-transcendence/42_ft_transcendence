import { useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function Email ({ stateEmail, fonctionUpdateEmail }) {

    const {email, validEmail} = stateEmail;
    const {updateEmail, updateValideEmail} = fonctionUpdateEmail;

    useEffect(() => {
        updateValideEmail(EMAIL_REGEX.test(email));
    }, [email])

    return (
        <>
                <label htmlFor="email">
                    Email:
                    <span className={validEmail ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validEmail || !email ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    type="text"
                    id="email" //même valeur que le label
                    // ref={userRef}
                    // autoComplete="off"
                    onChange={(e) => updateEmail(e.target.value)}
                    value={email}
                    required // champ requis
                />
                <p className={email && !validEmail ? "instructions" : "offscreen"} >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Enter valid email please.
                </p>
        </>
    )
}

export default Email;