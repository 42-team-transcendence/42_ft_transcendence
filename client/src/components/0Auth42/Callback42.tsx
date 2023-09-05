import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import io from 'socket.io-client';
import axios from "../../api/axios"

const socket = io('http://localhost:3333', {
	path: "/status",
	withCredentials: true,
	autoConnect: true,
	auth: { token: "TODO: gérer les tokens d'authentification ici" },
});

const Callback42 = () => {

    const navigate = useNavigate();
    const { setAuth } = useAuth();

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
        const intValue = parseInt(id42 || '', 10);
    
        socket.emit('userLoggedIn', {userId: intValue});
        
        handleMe();
        
        navigate('/', { replace: true });

    }, [setAuth, navigate]);
    

    return (
        <div>
        </div>
    )
}

export default Callback42;