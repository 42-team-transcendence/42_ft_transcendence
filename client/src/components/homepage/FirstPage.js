import React from "react";
import { useNavigate } from 'react-router-dom';

function FirstPage() {

    const navigate = useNavigate();
    const from_signup = "/register";
    const from_signin = "/login";

    const handleSignup = () => {
        navigate(from_signup, { replace: false});
    }

    const handleSignin = () => {
        navigate(from_signin, { replace: false});
    }

	return (
        <section>
            <form>
            <h1> WELCOME TO PONG </h1>

            <label><u>Need an Account ? </u> </label>
            <button onClick={handleSignup}>Sign Up</button>

            <label><u>Already Registered ? </u></label>
            <button onClick={handleSignin}>Sign In</button>

            </form>
        </section>
	)
}

export default FirstPage;