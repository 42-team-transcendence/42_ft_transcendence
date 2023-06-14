import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export default function Register() {
    //useRef is a React Hook that lets you reference a value that’s not needed for rendering.  
    //The useRef() hook in React is used to create a mutable reference that persists across re-renders of a component.
    //It returns a mutable ref object with a .current property.
    //updating the ref does not trigger a re-render,
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    return (
    <section>
        <p ref={errRef} className={errMsg? "errmsg" : "offscreen"}>
        </p>
        <h1>Register</h1>
        <form >
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
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required // champ requis
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
            />
            <p className={userFocus && user && !validName ? "instructions" : "offscreen"} >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.<br/>
                Must begin with a letter.<br/>
                Letters, numbers, underscores, hypens allowed
            </p>

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
                ref={userRef}
                onChange={(e) => setPwd(e.target.value)}
                required // champ requis
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
            />
            <p className={pwdFocus && user && !validPwd ? "instructions" : "offscreen"} >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br/>
                Must include uppercase and lowercase character, a number and a special character.<br/>
                Allowed special characters: !@#$%
            </p>

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
                ref={userRef}
                onChange={(e) => setMatchPwd(e.target.value)}
                required // champ requis
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p className={matchFocus && user && !validMatch ? "instructions" : "offscreen"} >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
            </p>

            <button disabled={!validName || !validPwd || !validMatch ? true : false }>
                Sign Up
            </button>

            <p>
                Already Registered ?<br />
                <span className="line">
                    {/* TODO Put router link here */}
                    {/* // placeholder link */}
                    <a href="#">Sign In</a>
                </span>
            </p>
        </form>
    </section>

        
    )

}
