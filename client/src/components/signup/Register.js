import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "../../api/axios";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import MatchPwd from "./MatchPwd";
import useAuth from '../../hooks/useAuth';


const REGISTER_URL = '/auth/signup';

export default function Register() {

    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const from = "/";

    // =============================================================================
	// USERS =======================================================================
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    
    const stateUser = {user, validName};

    const updateUser = (newValue) => {
        setUser(newValue);
    }
    const updateValideName = (newValue) => {
        setValidName(newValue);
    }
    const fonctionUpdate = {updateUser, updateValideName};


    // =============================================================================
	// EMAIL =======================================================================
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const stateEmail = {email, validEmail};

    const updateEmail = (newValue) => {
        setEmail(newValue);
    }
    const updateValideEmail = (newValue) => {
        setValidEmail(newValue);
    }
    const fonctionUpdateEmail = {updateEmail, updateValideEmail};
    
    
    // =============================================================================
	// PWD MATCH ===================================================================
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    
    const stateMatchPwd = {matchPwd, validMatch, user};
    
    const updateMatchPwd = (newValue) => {
        setMatchPwd(newValue);
    }
    const updateValideMatch = (newValue) => {
        setValidMatch(newValue);
    }
    
    const fonctionUpdateMatchPwd = {updateMatchPwd};
    

   	// =============================================================================
	// PASSWORD ====================================================================
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    
    const statePwd = {user, pwd, matchPwd, validPwd};
    
    const updatePwd = (newValue) => {
        setPwd(newValue);
    }
    const updateValidePwd = (newValue) => {
        setValidPwd(newValue);
    }
    const fonctionUpdatePwd = {updatePwd, updateValidePwd, updateValideMatch};

    
	// =============================================================================
	// =============================================================================
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd])


    const handleSubmit = async (e) => {
        e.preventDefault(); //on enlève le comportement par défaut du bouton pour mettre le n$otre
        
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ nickname : user, email, password : pwd }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
                );
            const accessToken = response?.data?.accessToken;
            setAuth({email, pwd, accessToken});
            navigate(from, { replace: false});
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
            <p className={errMsg? "errmsg" : "offscreen"}>
                {errMsg}
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
                    <Link to="/login">Sign In</Link>
                </span>
                </p>
            </form>
        </section>
    )
}
