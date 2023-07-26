import { Link, useNavigate } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

import '../../styles/Navbar.css';

const Logout: React.FC = () => {

    const from_signup = "/register"; 
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const {setAuth} = useAuth();


    const handleClick = () => {

        axiosPrivate.post('/auth/logout');
        setAuth({ accessToken: '', email: '', pwd: ''});// supprime l'accessToken du state auth.
        navigate(from_signup, { replace: true});//redirige vers la page register en remplacant l'historique.
    }

    return (
		<Link to="/register" onClick={handleClick} className="textLogout">Log out</Link>
    )
}

export default Logout;