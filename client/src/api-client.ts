import { RegisterFormData } from "./pages/Register.tsx";
import { SignInFormData } from "./pages/SignIn.tsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
}


export const logOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        throw new Error("Error in Logout");
    }
}

export const addMyHotel = async (hotelFormData: FormData) => {
    console.log("hotelFormData: ", hotelFormData)
    const response = await fetch(`${API_BASE_URL}/api/hotel/create`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add hotel");
    }

    return response.json();
};