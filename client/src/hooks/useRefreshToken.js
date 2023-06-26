import axios from "../api/axios"
import useAuth from "./useAuth"

function useRefreshToken() {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await axios.post(
			'/auth/refresh',
			{},
			{
			  headers: { 'Content-Type': 'application/json' },
			  withCredentials: true,
		});

		setAuth(prev => {
			console.log('prev == ' , JSON.stringify(prev));
			console.log('Access Token == ', response.data.accessToken);
			return { ...prev, accessToken: response.data.accessToken}
		});
		return response.data.accessToken;
	}

	return refresh;
}

export default useRefreshToken;