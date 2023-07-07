// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import AuthContext from '../context/AuthProvider';

// const RequireAuth = () => {
//     const { auth } = useAuth();
//     const location = useLocation();
    
//     // console.log("EMAIL == " + auth.email);
//     console.log("TOKENS == " + auth.accessToken);

//     return (
//         auth?.accessToken
//             ? <Outlet />
//             : <Navigate to="/register" state={{from: location}} replace />
//     );
// }

// export default RequireAuth;

import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = (): JSX.Element => {
    const AuthContext = useAuth();
    const location = useLocation();
    
    // console.log("EMAIL == " + auth?.email);
    console.log("TOKENS == " + AuthContext?.auth?.accessToken);

    return (
        AuthContext?.auth?.accessToken
            ? <Outlet />
            : <Navigate to="/register" state={{from: location}} replace />
    );
}

export default RequireAuth;
