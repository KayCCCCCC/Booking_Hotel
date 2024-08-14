import { useMutation } from "react-query"
import ManageHotelForm from "../forms/ManageHotel/ManageHotelForm"
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext"
const AddHotel = () => {
    const { showToast } = useAppContext();
    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({
                message: "Hotel Save",
                type: "success"
            })
        },
        onError: (error: Error) => {
            showToast({
                message: error.message,
                type: "error"
            })
        }
    });
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    }
    return (
        <>
            <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
        </>
    )
}

export default AddHotel