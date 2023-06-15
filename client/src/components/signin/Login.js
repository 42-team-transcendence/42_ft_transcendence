import { useRef, useState, useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";
import Email from "./Email";
import Password from "./Password";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation} from "react-router-dom"

const SIGNIN_URL = '/auth/signin';

export default function Login() {
    const {setAuth} = useAuth();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await axios.post(
                SIGNIN_URL,
                JSON.stringify({ password: pwd, email }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
			const accessToken = response?.data?.access_token;
			setAuth({email, pwd, accessToken});
			setEmail('');
			setPwd('');
			navigate(from, { replace: true});
			
			console.log(JSON.stringify(response?.data));
    
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
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>

            <Email email={email} setEmail={setEmail} />
            <Password pwd={pwd} setPwd={setPwd} />

            <button disabled={ !email || !pwd  ? true : false }>
                Sign In
            </button>
            <p>
                Not Registered yet ?<br />
                <span className="line">
                    {/* TODO Put router link here */}
                    {/* // placeholder link */}
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
            </form>
        </section>
        )}
        </>
    )
}
