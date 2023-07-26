// import axios from "../api/axios"
// import useAuth from "./useAuth"

// function useRefreshToken() {
// 	const { auth, setAuth } = useAuth();

// 	const refresh = async () => {
// 			//TODO ajouter un try catch !
// 			const response = await axios.post(
// 				'/auth/refresh',
// 				{},
// 				{
// 					headers: { 'Content-Type': 'application/json' },
// 					withCredentials: true,
// 				});
				
// 				setAuth(prev => {
// 					return { ...prev, accessToken: response.data.accessToken}
// 				});
// 				return response.data.accessToken;
// 	}
// 	return refresh;
// }

// export default useRefreshToken;

import axios from "../api/axios";
import { AxiosResponse } from "axios"; // Import AxiosResponse type
import useAuth from "./useAuth";

function useRefreshToken(): () => Promise<string> {
  const { auth, setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response: AxiosResponse<{ accessToken: string }> = await axios.post(
        '/auth/refresh',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setAuth((prev) => {
        return { ...prev, accessToken: response.data.accessToken };
      });

      return response.data.accessToken;
    } catch (error) {
      // Handle error here
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  return refresh;
}

export default useRefreshToken;
