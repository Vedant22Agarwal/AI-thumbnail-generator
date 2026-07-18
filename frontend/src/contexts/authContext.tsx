import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import api from "../config/api";
import type { IUser } from "../../public/assets/assets";

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user: IUser | null;
    setUser: (user: IUser | null) => void;

    login: (user: {
        email: string;
        password: string;
    }) => Promise<void>;

    signup: (user: {
        name: string;
        email: string;
        password: string;
    }) => Promise<void>;

    logout: () => Promise<void>;
}

interface AuthResponse {
    message: string;
    user: IUser;
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    user: null,
    setUser: () => { },
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
});

const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || error.message);
        } else if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("Something went wrong");
        }
    };

    const signup = async ({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) => {
        try {
            const { data } = await api.post<AuthResponse>(
                "/api/users/register",
                {
                    name,
                    email,
                    password,
                }
            );

            setUser(data.user);
            setIsLoggedIn(true);

            toast.success(data.message);
        } catch (error) {
            handleError(error);
        }
    };

    const login = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        try {
            const { data } = await api.post<AuthResponse>(
                "/api/users/login",
                {
                    email,
                    password,
                }
            );

            setUser(data.user);
            setIsLoggedIn(true);

            toast.success(data.message);
        } catch (error) {
            handleError(error);
        }
    };
    const logout = async () => {
         console.log("Logout clicked");
        try {
            const { data } = await api.get<{ message: string }>(
                "/api/users/logout"
            );

            setUser(null);
            setIsLoggedIn(false);

            toast.success(data.message);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await api.get<AuthResponse>(
                "/api/users/verify"
            );

            setUser(data.user);
            setIsLoggedIn(true);
        } catch {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const value: AuthContextProps = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContextProvider };

export default function useAuthContext() {
    return useContext(AuthContext);
}