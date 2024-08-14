import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router"
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotel/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
const EditHotel = () => {
    const { showToast } = useAppContext();
    const { hotelId } = useParams();
    const { data: hotel } = useQuery("fetchMyHotelsById", () => apiClient.fetchMyHotelsById(hotelId || ''), {
        enabled: !!hotelId
    })
    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({
                message: "Update hotel successfully",
                type: "success"
            })
        },
        onError: () => {
            showToast({
                message: "Error in update hotel",
                type: "error"
            })
        }
    });
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    }
    return (
        <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
    )
}

export default EditHotel