// import { createContext, useState, useEffect } from "react";

// /* Ici, nous créons un contexte appelé "AuthContext" en utilisant la fonction createContext. Un contexte est comme un espace spécial où nous pouvons stocker des informations que nous voulons partager avec d'autres parties de notre application. */
// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//     //Mauvaise pratique de stocker notre access token dans local storage
//     // const storedAuth = localStorage.getItem('auth');
//     // const [auth, setAuth] = useState(storedAuth ? JSON.parse(storedAuth) : {});
//     // useEffect(() => {
//     //     localStorage.setItem('auth', JSON.stringify(auth));
//     // }, [auth]);
//     const [auth, setAuth] = useState({});


// 	/* return (...). Ici, nous utilisons <AuthContext.Provider value={{auth, setAuth}}> ... </AuthContext.Provider> pour envelopper les composants enfants avec le contexte d'authentification. Cela signifie que tous les composants enfants pourront accéder aux informations d'authentification grâce à ce contexte. */
//     return (
//         <AuthContext.Provider value={{auth, setAuth}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export default AuthContext;

import { createContext, useState, useEffect } from "react";

interface Auth {
  // Define the structure of the auth object
  accessToken: string;
  //refreshToken: string;
  email:string;
  pwd:string;
}

interface AuthContextProps {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

const AuthContext = createContext<AuthContextProps>({
  auth: {} as Auth,
  setAuth: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>({} as Auth);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth) as Auth);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

