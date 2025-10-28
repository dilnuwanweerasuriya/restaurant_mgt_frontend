import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const decodeToken = (token) => {
        try {
            const payloadBase64 = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return decodedPayload;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
                setUser({
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    name: decoded.name || "",
                });
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = decodeToken(token);
        if (decoded) {
            setUser({
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name || "",
            });
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-600 text-lg">Loading...</div>
            </div>
        );

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
