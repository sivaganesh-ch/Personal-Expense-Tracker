import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const { data } = await axios.get('http://localhost:5000/api/auth/me', config);
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                localStorage.removeItem('token');
                setUser(null);
                setError(err.response?.data?.message || 'Session expired');
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    // Register
    const register = async (name, email, password) => {
        try {
            setError(null);
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
