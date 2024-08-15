export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number
}

export type BookingType = {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: Date;
    checkOut: Date;
    totalCost: number;
};