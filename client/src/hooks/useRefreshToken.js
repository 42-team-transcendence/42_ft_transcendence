import axios from "../api/axios"
import useAuth from "./useAuth"

function useRefreshToken() {
	const { auth, setAuth } = useAuth();

	const refresh = async () => {
			//TODO ajouter un try catch !
			const response = await axios.post(
				'/auth/refresh',
				{},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				});
				
				setAuth(prev => {
					return { ...prev, accessToken: response.data.accessToken}
				});
				return response.data.accessToken;
	}
	return refresh;
}

export default useRefreshToken;