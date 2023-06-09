import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import Email from './Email';
import Password from './Password';

// STYLE =====================================================
import CustomButton from "../../styles/buttons/CustomButton";
import Box from '@mui/material/Box';
import '../../styles/Register_Login.css';



 // =============================================================================
 // =============================================================================
const LOGIN_URL = '/auth/signin'

function Login () {

    const { setAuth } = useAuth();

    const navigate = useNavigate(); //useNavigate retourne une fct qui permet de naviguer vers d'autres pages de l'appli
    const location = useLocation(); // useLocation retourne un objet qui contient des éléments sur l'URL de la page actuelle
    const from = location.state?.from?.pathname || "/"; //from = chemin de la page précédente à partir de laquelle l'utilisateur est arrivé sur la page de connexion

    // =============================================================================
	// EMAIL =======================================================================
    const [email, setEmail] = useState('');

    const stateEmail = {email};

    const updateEmail = (newValue) => {
        setEmail(newValue);
    }

    const fonctionUpdateEmail = {updateEmail};

    // =============================================================================
	// PASSWORD ====================================================================
    const [pwd, setPwd] = useState('');

    const statePwd = {pwd};

    const updatePwd = (newValue) => {
        setPwd(newValue);
    }

    const fonctionUpdatePwd = {updatePwd};

    /// =============================================================================
	// 	=============================================================================
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, 
                JSON.stringify({email, 'password': pwd}),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            // console.log({"test": response?.data})
            const accessToken = response?.data?.accessToken;
            //TODO est ce important de set l'email et le pwd dans auth ? 
            setAuth({email, pwd, accessToken});
            setEmail('');
            setPwd('');
            navigate(from, { replace: true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                setErrMsg(err.status + ' : ' +  err.response + 'Sign In failed');
                console.log(err);
            }
        }
    }
    return (
        <section className="Register">
            <h1 className="title">PONG</h1>
            <form className="formLogin" onSubmit={handleSubmit}>
				<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							'& .MuiTextField-root': { m: 1, width: '25ch' },
						}}
						autoComplete="off"
				>
                
                <Email stateEmail={stateEmail} fonctionUpdateEmail={fonctionUpdateEmail} />
                <Password statePwd={statePwd} fonctionUpdatePwd={fonctionUpdatePwd} />

					<CustomButton
						onClick={handleSubmit}
						disabled={ !email || !pwd  ? true : false }
					>
						Sign in
					</CustomButton>
				</Box>
            <p>
                Need an Account ?<br />
        
                    {/* TODO Put router link here */}
                    {/* // placeholder link */}
                    <Link to="/register" className="line">Sign Up</Link>
            </p>
            </form>
        </section>
    )
}

export default Login;