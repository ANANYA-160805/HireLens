import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);

            const data = await login({ email, password });

            setUser(data.user);

            return data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);

            const data = await register({ username, email, password });

            setUser(data.user);

            return data;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);

            await logout();

            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

   
    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};