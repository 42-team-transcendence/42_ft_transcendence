import axios from "../../api/axios"
import CustomButton from "../../styles/buttons/CustomButton";
import useAuth from "../../hooks/useAuth";
import io from 'socket.io-client';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const socket = io('http://localhost:3333', {
	path: "/status",
	withCredentials: true,
	autoConnect: true,
	auth: { token: "TODO: gérer les tokens d'authentification ici" },
});

const AuthPage:React.FC = () => {

	const {auth, setAuth} = useAuth();
	const axiosPrivate = useAxiosPrivate();

    const handleClick = async() => {
		const email = auth.email;
		console.log(`email dans auth42`, email);
        try{
            axios.get('/auth/login/42')
                .then((res) => {
                window.location.href = res.data.url;
				
            });
			const response = await axiosPrivate.get(`/auth/userByMail/${email}`, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
			  });
			console.log("Response logout dasn 42", response)
			socket.emit('userLoggedIn', {userId: response.data.id});
        }
        catch{
			window.alert("can't login with 42");
        }

    }

    return (
        <CustomButton onClick={handleClick}>
            Log In with 42
        </CustomButton>
    )
}

export default AuthPage;
