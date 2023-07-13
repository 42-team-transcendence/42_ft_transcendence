// import { Outlet } from "react-router-dom"; //on utilise react 6 ?
// import { useState, useEffect } from "react";
// import useRefreshToken from "../hooks/useRefreshToken";
// import useAuth from "../hooks/useAuth";
import AuthContext from '../context/AuthProvider';

// const PersistLogin = () => {
//     const [isLoading, setIsLoading] = useState(true);
//     const refresh = useRefreshToken();
//     const {auth} = useAuth();

//     useEffect(() => {
//         const verifyRefreshToken = async () => {
//             try {
//                 await refresh();
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         }

//         console.log({auth});
//         //Si il n'y a pas d'access token dans auth (par exemple si on vient de refresh) 
//         // ==> on redemande un accessToken
//         !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
//     }, [])

//     // useEffect(() => {
//     //     console.log("is loading: " + isLoading)
//     //     console.log('access token ' + JSON.stringify(auth?.accessToken) )
//     // }, [isLoading])

//     return (
//         <>
//             {isLoading
//                 ? <p>Loading...</p>
//                 : <Outlet />
//             }
        
//         </>
//     )
// }

// export default PersistLogin;

import { Outlet } from "react-router-dom"; //on utilise react 6 ?
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

interface AuthData{
    accesToken: string;
}

const PersistLogin = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const refresh = useRefreshToken();
    const AuthContext = useAuth();

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

        console.log(AuthContext);
        //Si il n'y a pas d'access token dans auth (par exemple si on vient de refresh) 
        // ==> on redemande un accessToken
        !AuthContext?.auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [])

    // useEffect(() => {
    //     console.log("is loading: " + isLoading)
    //     console.log('access token ' + JSON.stringify(auth?.accessToken) )
    // }, [isLoading])

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

/**
 * J'ai modifié la variable auth en authContext pour éviter
 *  toute confusion avec le type AuthContextType. 
 * J'ai également effectué une vérification de nullité 
 * (authContext?.auth?.accessToken) pour accéder 
 * en toute sécurité à la propriété accessToken dans
 *  authContext.
 * Cela devrait éviter l'erreur de type que je rencontre
 *  selon gpt.
 */