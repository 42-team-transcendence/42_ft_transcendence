import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import io from 'socket.io-client';
import axios from "../../api/axios"
import TwoFaLogin from "../signin/twoFaLogin";

const socket = io('http://localhost:3333', {
	path: "/status",
	withCredentials: true,
	autoConnect: true,
	auth: { token: "TODO: gérer les tokens d'authentification ici" },
});

const Callback42 = () => {

    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [display2fa, setDisplay2fa] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [id, setId] = useState<number>(0);

    const valid2Fa = async () => {

        const response = await axios.get('/auth/2fa_42', 
        {
            params: { email },
            headers: { 'Content-Type': 'application/json'},
                withCredentials: true
            }
        );
        socket.emit('userLoggedIn', {userId: id});
        setAuth({
            email: email,
            pwd: "",
            accessToken: response.data.token || "",
        });
        navigate('/', { replace: true });
    }

    useEffect(() => {

        const handleMe = async () => {
            
            // Créez un objet de configuration Axios pour inclure le token d'authentification
            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajoutez le token d'authentification ici
                },
                withCredentials: true
            };

            const response = await axios.get('/users/me', axiosConfig);

            setAuth({
                email: response.data.email,
                pwd: "",
                accessToken: token || "",
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const id42 = urlParams.get('id');
        const email42 = urlParams.get('email');
        const isOnline42 = urlParams.get('isOnline');
        const intValue = parseInt(id42 || '', 10);
        
        if (isOnline42 === "true"){
            navigate("/register");
        }
        else if (!email42 && token && isOnline42 === "false") {
            socket.emit('userLoggedIn', {userId: intValue});
            
            handleMe();
            
            navigate('/', { replace: true });
        }
        else if (email42 && !token) {
            setEmail(email42);
            setId(intValue);
            setDisplay2fa(true);
        }

    }, [setAuth, navigate]);
    

    return (
        <div>
                {display2fa && <TwoFaLogin email={email} valid2Fa={valid2Fa} />}
        </div>
    )
}

export default Callback42;