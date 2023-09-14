import axios from "../api/axios";
import { AxiosResponse } from "axios"; // Import AxiosResponse type
import useAuth from "./useAuth";

function useRefreshToken(): (() => Promise<string>) | undefined { // Modifiez le type de retour
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

  // Ajoutez une vérification de la condition ici
  const checkUsers = async () => {
    try {
      const response = await axios.get("/users/number", {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (response.data === 0) {
        // Ne retournez pas la fonction refresh si la condition est vraie
        return undefined;
      } else {
        // Si la condition n'est pas vraie, retournez la fonction refresh
        return refresh;
      }
    } catch (error) {
      throw error;
    }
  };

  // Retournez la fonction checkUsers
  return undefined;
}

export default useRefreshToken;




// import axios from "../api/axios";
// import { AxiosResponse } from "axios"; // Import AxiosResponse type
// import useAuth from "./useAuth";

// function useRefreshToken(): () => Promise<string> {
//   const { setAuth } = useAuth();

  
//   const refresh = async (): Promise<string> => {
//     try {
//       const response: AxiosResponse<{ accessToken: string }> = await axios.post(
//         '/auth/refresh',
//         {},
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true,
//         }
//       );

//       setAuth((prev) => {
//         return { ...prev, accessToken: response.data.accessToken };
//       });

//       return response.data.accessToken;
//     } catch (error) {
//       throw error;
//     }
//   };

//   return refresh;
// }

// export default useRefreshToken;
