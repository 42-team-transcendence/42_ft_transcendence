import { createContext, useState, useEffect } from "react";

/* Ici, nous créons un contexte appelé "AuthContext" en utilisant la fonction createContext. Un contexte est comme un espace spécial où nous pouvons stocker des informations que nous voulons partager avec d'autres parties de notre application. */
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const storedAuth = localStorage.getItem('auth');
    const [auth, setAuth] = useState(storedAuth ? JSON.parse(storedAuth) : {});

    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);
    // const [auth, setAuth] = useState({});


	/* return (...). Ici, nous utilisons <AuthContext.Provider value={{auth, setAuth}}> ... </AuthContext.Provider> pour envelopper les composants enfants avec le contexte d'authentification. Cela signifie que tous les composants enfants pourront accéder aux informations d'authentification grâce à ce contexte. */
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;