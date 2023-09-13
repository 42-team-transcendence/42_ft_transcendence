import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth: React.FC = () => {
    const { auth } = useAuth();
    const location = useLocation();

    console.log("RequireAuth: ", auth);

    return (
        auth?.accessToken
            ? <Outlet />
            : <Navigate to="/register" state={{from: location}} replace />
    );
}

export default RequireAuth;
