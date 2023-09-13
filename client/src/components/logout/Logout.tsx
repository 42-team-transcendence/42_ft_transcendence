import { Link, useNavigate } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import io from 'socket.io-client';
import { useSocket } from "../../context/SocketProvider";
import '../../styles/Navbar.css';

const Logout: React.FC = () => {

    const from_signup = "/register";
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();
	const socket = useSocket();

    const handleClick = async() => {

		const handleOnline =  async () => {
			const email = auth.email;
			try{
				const response = await axiosPrivate.get(`/auth/userByMail/${email}`, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
			});
				socket?.emit('userLogout', {userId: response.data.id});
			}catch (error){
				console.error(error)
			}
		}

		try{
			handleOnline();
			await axiosPrivate.post('/auth/logout');
			setAuth({ accessToken: '', email: '', pwd: ''});// supprime l'accessToken du state auth.
			navigate(from_signup, { replace: true});//redirige vers la page register en remplacant l'historique.
		}catch (error){
			console.error(error)
		}
	}

    return (
		<Link to="/register" onClick={handleClick} className="textLogout">Log out</Link>
    )
}

export default Logout;
