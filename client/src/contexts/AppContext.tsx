import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || ""

type ToastMessage = {
    message: string;
    type: "success" | "error";
}

type AppContext = {
    showToast: (message: ToastMessage) => void;
    isLogin: boolean;
    stripePromise: Promise<Stripe | null>;
}

const AppContext = createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY)

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
            isLogin: !isError,
            stripePromise
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}