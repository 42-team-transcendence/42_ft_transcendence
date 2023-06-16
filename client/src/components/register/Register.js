import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import axios from "../../api/axios";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import MatchPwd from "./MatchPwd";

const REGISTER_URL = '/auth/signup';

export default function Register() {
    //useRef is a React Hook that lets you reference a value that’s not needed for rendering.  
    //The useRef() hook in React is used to create a mutable reference that persists across re-renders of a component.
    //It returns a mutable ref object with a .current property.
    //updating the ref does not trigger a re-render,


    /******************************** USERS***************************************************************** */
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    
    const stateUser = {user, validName, userFocus};

    const updateUser = (newValue) => {
        setUser(newValue);
    }
    const updateUserFocus = (newValue) => {
        setUserFocus(newValue);
    }
    const updateValideName = (newValue) => {
        setValidName(newValue);
    }
    const fonctionUpdate = {updateUser, updateUserFocus, updateValideName};

    /******************************** EMAIL***************************************************************** */

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const stateEmail = {email, validEmail, emailFocus};

    const updateEmail = (newValue) => {
        setEmail(newValue);
    }
    const updateEmailFocus = (newValue) => {
        setEmailFocus(newValue);
    }
    const updateValideEmail = (newValue) => {
        setValidEmail(newValue);
    }
    const fonctionUpdateEmail = {updateEmail, updateEmailFocus, updateValideEmail};
    
    
    /********************************PASSWORD_MATCH***************************************************************** */
    
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    
    const stateMatchPwd = {matchPwd, validMatch, matchFocus, user};
    
    const updateMatchPwd = (newValue) => {
        setMatchPwd(newValue);
    }
    const updateMatchPwdFocus = (newValue) => {
        setMatchFocus(newValue);
    }
    const updateValideMatch = (newValue) => {
        setValidMatch(newValue);
    }
    
    const fonctionUpdateMatchPwd = {updateMatchPwd, updateMatchPwdFocus};
    
    /********************************PASSWORD********************************************************************/
    
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    
    const statePwd = {user, pwd, matchPwd, validPwd, pwdFocus};
    
    const updatePwd = (newValue) => {
        setPwd(newValue);
    }
    const updatePwdFocus = (newValue) => {
        setPwdFocus(newValue);
    }
    const updateValidePwd = (newValue) => {
        setValidPwd(newValue);
    }
    const fonctionUpdatePwd = {updatePwd, updatePwdFocus, updateValidePwd, updateValideMatch};

    /*************************************************************************************************************/

    const [errMsg, setErrMsg] = useState('');

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

        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ nickName : user, email, password : pwd }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            //TODO if needed : clear input fields avec les setStates
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                //vérifier le statut de la réponse : err.response.status
                //409...
                setErrMsg('Registration failed');
                console.log(err);
            }
        }
    }
    return (
        <section>
            <p /*ref={errRef}*/ className={errMsg? "errmsg" : "offscreen"}>
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>

                <Username stateUser={stateUser} fonctionUpdate={fonctionUpdate}/>
                <Email stateEmail={stateEmail} fonctionUpdateEmail={fonctionUpdateEmail}/>
                <Password statePwd={statePwd} fonctionUpdatePwd={fonctionUpdatePwd}/>
                <MatchPwd stateMatchPwd={stateMatchPwd} fonctionUpdateMatchPwd={fonctionUpdateMatchPwd} />

                <button disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false }>
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
    )
}
