import { useRef, useState, useEffect } from "react";
import { Routes, Route,Link } from "react-router-dom"
import axios from "../../api/axios";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import ConfirmPassword from "./ConfirmPasswords";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/auth/signup';

export default function Register() {
    //useRef is a React Hook that lets you reference a value that’s not needed for rendering.  
    //The useRef() hook in React is used to create a mutable reference that persists across re-renders of a component.
    //It returns a mutable ref object with a .current property.
    //updating the ref does not trigger a re-render,
    // const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    // const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    // const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    // const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    // const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault(); //on enlève le comportement par défaut du bouton pour mettre le n$otre
        
        //if button enabled with JS hack
        // const v1 = USER_REGEX.test(user);
        // const v2 = PWD_REGEX.test(pwd);
        // if (!v1 || !v2) {
        //     setErrMsg("Invalid Entry");
        //     return;
        // }
        console.log(user, pwd);

        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ nickName : user, password : pwd, email }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
            //TODO if needed : clear input fields avec les setStates
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                //vérifier le statut de la réponse : err.response.status
                //409...
                setErrMsg('Registration failed');
                console.log(err);
                
                // errRef.current.focus(); //????
            }
        }
        
    }

    return (
        <>
        {success ? (
            <section>
                <h1>Success !</h1>
                <p>
                    <a href="#">Sign In</a>
                </p>
            </section>
        ) : (
        <section>
            <p className={errMsg? "errmsg" : "offscreen"}>
                {errMsg}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>

            <Username user={user} setUser={setUser} validName={validName} setValidName={setValidName}  />
            <Email email={email} setEmail={setEmail} validEmail={validEmail} setValidEmail={setValidEmail}  />
            <Password pwd={pwd} setPwd={setPwd} validPwd={validPwd} setValidPwd={setValidPwd}  />
            <ConfirmPassword matchPwd={matchPwd} setMatchPwd={setMatchPwd} validMatch={validMatch} setValidMatch={setValidMatch}  pwd={pwd} />

            <button disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false }>
                Sign Up
            </button>
            <p>
                Already Registered ?<br />
                <span className="line">
                    {/* TODO Put router link here */}
                    {/* // placeholder link */}
                    <Link to="/login">Log In</Link>
                </span>
            </p>
            </form>
        </section>
        )}
        </>
    )
}
