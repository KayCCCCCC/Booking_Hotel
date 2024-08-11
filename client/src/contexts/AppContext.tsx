import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import * as apiClient from "../api-client";

type ToastMessage = {
    message: string;
    type: "success" | "error";
}

type AppContext = {
    showToast: (message: ToastMessage) => void;
    isLogin: boolean
}

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false
    })
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                if (toastMessage.type === "success") {
                    toast.success(toastMessage.message)
                } else if (toastMessage.type === "error") {
                    toast.error(toastMessage.message)
                }
            },
            isLogin: !isError
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}