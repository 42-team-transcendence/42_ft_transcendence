import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const storedAuth = localStorage.getItem('auth');
    const [auth, setAuth] = useState(storedAuth ? JSON.parse(storedAuth) : {});

    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);
    // const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;