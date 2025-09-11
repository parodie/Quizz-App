// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export default AuthContext;


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('email');
        if (token && email) {
            setUser({ email, token });
        }
        setLoading(false);
    }, []);

    const login = (email, token) => {
        localStorage.setItem('email', email);
        localStorage.setItem('jwt', token);
        setUser({ email, token });
    };

    const logout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('jwt');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


