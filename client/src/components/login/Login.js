import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Email from './Email';
import Password from './Password';

const LOGIN_URL = '/auth/signin'

function Login () {

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    /******************************** EMAIL***************************************************************** */

    const [email, setEmail] = useState('');

    const stateEmail = {email};

    const updateEmail = (newValue) => {
        setEmail(newValue);
    }

    const fonctionUpdateEmail = {updateEmail};

    /********************************PASSWORD********************************************************************/

    const [pwd, setPwd] = useState('');

    const statePwd = {pwd};

    const updatePwd = (newValue) => {
        setPwd(newValue);
    }

    const fonctionUpdatePwd = {updatePwd};

    /*************************************************************************************************************/

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, 
                JSON.stringify({email, password: pwd}),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({email, pwd, roles, accessToken});
            setEmail('');
            setPwd('');
            navigate(from, { replace: true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    }
    return (
        <section>
            <p /*ref={errRef}*/ className={errMsg? "errmsg" : "offscreen"}
            aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                
                <Email stateEmail={stateEmail} fonctionUpdateEmail={fonctionUpdateEmail} />
                <Password statePwd={statePwd} fonctionUpdatePwd={fonctionUpdatePwd} />

                <button>Sign In</button>
            </form>
            <p>
                Need an Account ?<br />
                <span className="line">
                    {/* TODO Put router link here */}
                    {/* // placeholder link */}
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    )
}

export default Login;