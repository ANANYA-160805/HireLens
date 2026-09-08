import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import { getMe } from "./services/auth.api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const [data] = await Promise.all([
                    getMe(),
                    new Promise((resolve) => setTimeout(resolve, 500)),
                ]);
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};