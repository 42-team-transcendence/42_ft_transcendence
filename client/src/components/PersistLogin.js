import { Outlet } from "react-router-dom"; //on utilise react 6 ?
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        console.log({auth});
        //Si il n'y a pas d'access token dans auth (par exemple si on vient de refresh) 
        // ==> on redemande un accessToken
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [])

    useEffect(() => {
        console.log("is loading: " + isLoading)
        console.log('access token ' + JSON.stringify(auth?.accessToken) )
    }, [isLoading])

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