import { Outlet } from "react-router-dom"; //on utilise react 6 ?
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios"
import { useNavigate } from "react-router-dom";

const PersistLogin: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        const verifyRefreshToken = async () => {
            try {
                if (refresh) {
                await refresh();
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        const checkUsers = async () => {
            try {
                const response = await axios.get("/users/number",
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                    }
                );
                if (response.data === 0) {
                    navigate('/register', {replace: true});
                }
                else {
                    //Si il n'y a pas d'access token dans auth (par exemple si on vient de refresh)
                    // ==> on redemande un accessToken
                    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        }
        checkUsers();
    }, [auth?.accessToken, navigate, refresh])

    return (
        <>
            {isLoading
                ? <p>Loading...</p>
                : <Outlet />
            }

        </>
    )
}

export default PersistLogin;
