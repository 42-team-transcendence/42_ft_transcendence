import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    
    console.log(auth.email);
    console.log(auth.accessToken);

    return (
        auth?.email
            ? <Outlet />
            : <Navigate to="/register" state={{from: location}} replace />
    );
}

export default RequireAuth;