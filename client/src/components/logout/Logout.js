import { Link, useNavigate } from "react-router-dom"

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

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
		<Link onClick={handleClick} className="textMenu">Log out</Link>
    )
}