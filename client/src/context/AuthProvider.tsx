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

import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

interface AuthData {
  accessToken: string;
  email: string;
}

interface AuthContextType {
  auth: AuthData;
  setAuth: Dispatch<SetStateAction<AuthData>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthData>({ accessToken: "", email: "" });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


/**
 utilisation des types Dispatch et SetStateAction
 fournis par React pour typer la fonction setAuth
 Dispatch et SetStateAction sont des types fournis par React pour aider à typer les fonctions de mise à jour d'état (setState) 
 dans les hooks de gestion de l'état (useState, useReducer, etc.). */