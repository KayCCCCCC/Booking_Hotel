import { useForm } from "react-hook-form";
import { UserType } from "../../Types/UserType"
import { PaymentIntentResponse } from "../../Types/PaymentType";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
    currentUser: UserType,
    paymentIntent: PaymentIntentResponse
}
export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    const stripe = useStripe(); // hook of stripe
    const elements = useElements();
    const navigate = useNavigate();
    const { isAdmin } = useAppContext();

    const search = useSearchContext();
    const { showToast } = useAppContext();
    const { hotelId } = useParams();

    const { mutate: bookroom, isLoading } = useMutation(apiClient.createRoomBooking, {
        onSuccess: () => {
            showToast({
                message: "Booking Room Successfully",
                type: "success"
            })
            isAdmin ? navigate("/") : navigate("/my-booking")
        },
        onError: (error: Error) => {
            showToast({
                message: error.message,
                type: "error"
            })
        }
    })

    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            paymentIntentId: paymentIntent.paymentIntentId,
            totalCost: paymentIntent.totalCost
        }
    });

    const onSubmit = async (formData: BookingFormData) => {
        if (stripe && elements) {
            const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement) as StripeCardElement
                }
            });
            if (result.paymentIntent?.status === "succeeded") {
                bookroom({ ...formData, paymentIntentId: result.paymentIntent.id })
            }
        } else {
            return
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">Confirm Your Detail</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("firstName")}
                    >
                    </input>
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("lastName")}
                    >
                    </input>
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}
                    >
                    </input>
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold"> Your Price Summary</h2>
                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: ${paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">Includes taxes and charges</div>
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold"> Payment Details</h3>
                <CardElement id="payment-element" className="border rounded-md p-2 text-sm" />
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md rounded disabled:bg-gray-500">
                    {isLoading ? "Saving..." : "Confirm Booking"}
                </button>
            </div>
        </form>
    )
}

export default BookingForm