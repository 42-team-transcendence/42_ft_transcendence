import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
	const { auth } = useAuth();
	const location = useLocation();

	return (
		auth?.user
			? <Outlet />
			// Navigate renvoit a Login/ From location permet de remplacer l'url"
			: <Navigate to="/login" state={{ from: location}} replace />
	);

}

export default RequireAuth;