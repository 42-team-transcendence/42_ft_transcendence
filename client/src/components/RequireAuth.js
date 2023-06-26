import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    
    console.log("EMAIL == " + auth.email);
    console.log("TOKENS == " + auth.accessToken);

    return (
        auth?.accessToken
            ? <Outlet />
            : <Navigate to="/register" state={{from: location}} replace />
    );
}

export default RequireAuth;