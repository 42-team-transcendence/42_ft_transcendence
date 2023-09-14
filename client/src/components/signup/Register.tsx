import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { AxiosError } from 'axios';
import axios, { axiosPrivate } from "../../api/axios";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import MatchPwd from "./MatchPwd";
import useAuth from '../../hooks/useAuth';
import AuthPage from "../0Auth42/AuthPage";
import { useSocket } from "../../context/SocketProvider";

// STYLE =====================================================
import CustomButton from "../../styles/buttons/CustomButton";
import Box from '@mui/material/Box';
import '../../styles/Register_Login.css';

// =============================================================================
// =============================================================================
const REGISTER_URL = '/auth/signup';

export default function Register() {

    const { setAuth } = useAuth();
	const socket = useSocket();
    const navigate = useNavigate();
    const from = "/";

    // =============================================================================
	// USERS =======================================================================
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);

    const stateUser = {user, validName};

    const updateUser = (newValue: string) => {
        setUser(newValue);
    }
    const updateValideName = (newValue: boolean) => {
        setValidName(newValue);
    }
    const fonctionUpdate = {updateUser, updateValideName};


    // =============================================================================
	// EMAIL =======================================================================
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const stateEmail = {email, validEmail};

    const updateEmail = (newValue: string) => {
        setEmail(newValue);
    }
    const updateValideEmail = (newValue: boolean) => {
        setValidEmail(newValue);
    }
    const fonctionUpdateEmail = {updateEmail, updateValideEmail};


    // =============================================================================
	// PWD MATCH ===================================================================
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const stateMatchPwd = {matchPwd, validMatch, user};

    const updateMatchPwd = (newValue: string) => {
        setMatchPwd(newValue);
    }
    const updateValideMatch = (newValue: boolean) => {
        setValidMatch(newValue);
    }

    const fonctionUpdateMatchPwd = {updateMatchPwd};


   	// =============================================================================
	// PASSWORD ====================================================================
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const statePwd = {user, pwd, matchPwd, validPwd};

    const updatePwd = (newValue: string) => {
        setPwd(newValue);
    }
    const updateValidePwd = (newValue: boolean) => {
        setValidPwd(newValue);
    }
    const fonctionUpdatePwd = {updatePwd, updateValidePwd, updateValideMatch};


	// =============================================================================
	// =============================================================================
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //on enlève le comportement par défaut du bouton pour mettre le n$otre

        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ nickname: user, email, password: pwd }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
                );
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.userId;
            setAuth({email, pwd, accessToken, userId});

			const response2 = await axiosPrivate.get(`/auth/userByMail/${email}`, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
			  });

			// Envoyez un événement au serveur pour signaler la connexion réussie
			socket?.emit('userLoggedIn', {userId: response2.data.id, userEmail: email});

            navigate(from, { replace: false});
            //TODO if needed : clear input fields avec les setStates
        } catch (err: AxiosError | any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                //vérifier le statut de la réponse : err.response.status
                //409...
                setErrMsg('Registration failed : ' + err.response.data.error + " ; " + err.response.data.message);
                console.log({error : err.response});
            }
        }
    }

    return (
        <section className="Register">
            <p className={errMsg? "errmsg" : "offscreen"}>
                {errMsg}
            </p>
            <h1 className="title">PONG</h1>
            <form onSubmit={handleSubmit} id="myForm">
				<Box
					sx={{
                        display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						'& .MuiTextField-root': { m: 1, width: '25ch' },
					}}
				>
                    <AuthPage />
                    <p>
                        <br/>
                        or signup with email adress
                    </p>
					<Username stateUser={stateUser} fonctionUpdate={fonctionUpdate}/>
					<Email stateEmail={stateEmail} fonctionUpdateEmail={fonctionUpdateEmail}/>
					<Password statePwd={statePwd} fonctionUpdatePwd={fonctionUpdatePwd}/>
					<MatchPwd stateMatchPwd={stateMatchPwd} fonctionUpdateMatchPwd={fonctionUpdateMatchPwd} />
					<CustomButton
						onClick={handleSubmit}
						disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false }
					>
						Sign Up
					</CustomButton>
				</Box>
                <p>
					Already got an account ?<br />
					{/* //TODO Put router link here
					//TODO placeholder link */}
					<Link to="/login" className="line">Log in</Link>
                </p>
            </form>
        </section>
    )
}
