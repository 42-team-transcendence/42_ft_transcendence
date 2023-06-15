import { useRef, useState, useEffect } from "react";
import axios from "../../api/axios";
import Email from "./Email";
import Password from "./Password";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const SIGNIN_URL = '/auth/signin';

export default function Register() {
    //useRef is a React Hook that lets you reference a value that’s not needed for rendering.  
    //The useRef() hook in React is used to create a mutable reference that persists across re-renders of a component.
    //It returns a mutable ref object with a .current property.
    //updating the ref does not trigger a re-render,
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault(); //on enlève le comportement par défaut du bouton pour mettre le n$otre
        
        try {
            const response = await axios.post(
                SIGNIN_URL,
                JSON.stringify({ password : pwd, email }),
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
                setErrMsg('Sign In failed');
                console.log(err);
                
                errRef.current.focus(); //????
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
                Already Registered ?<br />
                <span className="line">
                    {/* TODO Put router link here */}
                    {/* // placeholder link */}
                    <a href="#">Sign In</a>
                </span>
            </p>
            </form>
        </section>
        )}
        </>
    )
}
