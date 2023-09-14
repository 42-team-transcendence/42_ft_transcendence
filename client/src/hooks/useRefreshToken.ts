import axios from "../api/axios";
import { AxiosResponse } from "axios"; // Import AxiosResponse type
import useAuth from "./useAuth";

function useRefreshToken(): () => Promise<string> {
  const { setAuth } = useAuth();

  
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
      throw error;
    }
  };

  return refresh;
}

export default useRefreshToken;
