import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import '../../styles/App.css';

export default function Logout () {

    const from_signup = "/register"; 
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const {setAuth} = useAuth();


    const handleClick = () => {

        axiosPrivate.post('/auth/logout');
        setAuth({});// supprime l'accessToken du state auth.
        navigate(from_signup, { replace: true});//redirige vers la page register en remplacant l'historique.
    }

    return (
        <button className="button-logout" onClick={handleClick}>Log Out</button>
    )
}