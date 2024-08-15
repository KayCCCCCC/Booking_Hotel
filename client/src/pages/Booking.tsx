import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/Booking/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";
const Booking = () => {
    const search = useSearchContext();
    const { stripePromise } = useAppContext();
    const { hotelId } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights =
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24);

            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    // create payment intent
    const { data: paymentIntentData } = useQuery("createPaymentIntent", () => apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()), {
        enabled: !!hotelId && numberOfNights > 0
    })

    // get info hotel
    const { data: hotel } = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string), {
        enabled: !!hotelId
    })

    // get info user
    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);

    if (!hotel) {
        return <><div>Hotel Booking Not Found or Not Exist!</div></>
    }

    return (
        <div className="grid md:grid-cols-[1fr_2fr] gap-5">
            {hotel && <BookingDetailsSummary checkIn={search.checkIn} checkOut={search.checkOut} adultCount={search.adultCount} childCount={search.childCount} numberOfNights={numberOfNights} hotel={hotel} />}
            {currentUser && paymentIntentData && (
                // payment ui
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret
                }}>
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                </Elements>
            )}
        </div>
    )
}

export default Booking