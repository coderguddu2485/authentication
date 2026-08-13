import { createContext ,useEffect,useState } from "react";b
import api from "../services/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const login = async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        const data = response.data;

        if (data.success) {
            localStorage.setItem("token", data.token);
            const profileResponse = await api.get("/auth/profile");
            setUser(profileResponse.data.user);
        }

        return data;
    };

    const getProfile = async () => {
    try {
        const response = await api.get("/auth/profile");

        setUser(response.data.user);

    } catch (error) {
        localStorage.removeItem("token");
        setUser(null);

    } finally {
        setLoading(false);
    }
};

       useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (token) {
            getProfile();
        }else {
        setLoading(false);
    }

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;