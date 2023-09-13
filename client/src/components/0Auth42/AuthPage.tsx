import axios from "../../api/axios"
import CustomButton from "../../styles/buttons/CustomButton";
import useAuth from "../../hooks/useAuth";
import io from 'socket.io-client';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const socket = io('http://localhost:3333', {
	path: "/status",
	withCredentials: true,
	autoConnect: true,
	auth: { token: "TODO: gérer les tokens d'authentification ici" },
});

const AuthPage:React.FC = () => {
	const { auth } = useAuth();

    const handleClick = async() => {
		const email = auth.email;
		console.log(`email dans auth42`, email);
        try {
            axios.get('/auth/login/42').then((res) => {
                console.log("chACHAHCAHCHAH", res.data.url);
                window.location.href = res.data.url;
            })
        } catch (error) {
			window.alert("can't login with 42");
            console.log(error);
        }
    }

    return (
        <CustomButton onClick={handleClick}>
            Log In with 42
        </CustomButton>
    )
}

export default AuthPage;
