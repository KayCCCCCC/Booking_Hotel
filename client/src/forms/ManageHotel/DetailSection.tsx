import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm";

const DetailSection = () => {
    const { register, formState: { errors }, watch } = useFormContext<HotelFormData>();
    const existHotel = watch("name");
    return (
        <div className="flex flex-col gap-4">
            {existHotel ? <div className="text-3xl font-bold mb-3">Update Hotel</div> : <div className="text-3xl font-bold mb-3">Add Hotel</div>}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Name
                <input type="text" className="border rounded w-full py-1 px-2 font-normal" {...register("name", { required: "Name is required" })}></input>
                {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                )}
            </label>
            <div className="flex gap-4">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    City
                    <input type="text" className="border rounded w-full py-1 px-2 font-normal" {...register("city", { required: "City is required" })}></input>
                    {errors.city && (
                        <span className="text-red-500">{errors.city.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Country
                    <input type="text" className="border rounded w-full py-1 px-2 font-normal" {...register("country", { required: "Country is required" })}></input>
                    {errors.country && (
                        <span className="text-red-500">{errors.country.message}</span>
                    )}
                </label>
            </div>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Description
                <textarea rows={10} className="border rounded w-full py-1 px-2 font-normal" {...register("description", { required: "Description is required" })}></textarea>
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Price Per Night
                <input type="number" className="border rounded w-full py-1 px-2 font-normal" {...register("pricePerNight", { required: "Price Per Night is required", validate: (value) => value > 0 || "Price Per Night must be greater than 0", })}></input>
                {errors.pricePerNight && (
                    <span className="text-red-500">{errors.pricePerNight.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Star Rating
                <select className="border rounded w-full py-1 px-2 font-normal" {...register("starRating", { required: "Star Rating is required" })}>
                    <option value="" className="text-sm font-bold">
                        Select as Rating
                    </option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
                {errors.starRating && (
                    <span className="text-red-500">{errors.starRating.message}</span>
                )}
            </label>
        </div>
    )
}

export default DetailSection