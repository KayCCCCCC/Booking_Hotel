import { RegisterFormData } from "./pages/Register.tsx";
import { SignInFormData } from "./pages/SignIn.tsx";
import { HotelSearchResponse, HotelType } from "./Types/HotelType.ts";
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


export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotel/get-by-userId`, {
        method: "GET",
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Error in fetching hotels");
    }
    return response.json();
}

export const fetchMyHotelsById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotel/get-by-id/${hotelId}`, {
        method: "GET",
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Error in fetching hotels");
    }
    return response.json();
}

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotel/update/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        body: hotelFormData,
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Error in update hotels");
    }
    return response.json();
}

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string
}

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");
    queryParams.append("maxPrice", searchParams.maxPrice || "")
    queryParams.append("sortOption", searchParams.sortOption || "")

    searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility))
    searchParams.types?.forEach((type) => queryParams.append("types", type))
    searchParams.stars?.forEach((star) => queryParams.append("stars", star))

    const response = await fetch(`${API_BASE_URL}/api/hotel/search?${queryParams}`, {
        method: "GET",
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Error in search hotels");
    }
    return response.json();
}