import { useMutation, useQueryClient } from "react-query"
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext"
import { useNavigate } from "react-router";

const SignOutButton = () => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const mutation = useMutation(apiClient.logOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken"), // retry queries
                showToast({
                    message: "Sign Out Successfully",
                    type: "success",
                })
            navigate("/")
        },
        onError: (error: Error) => {
            showToast({
                message: error.message,
                type: "error",
            })
        }
    })
    const handleClick = () => {
        mutation.mutate();
    }
    return (
        <button className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 rounded" onClick={handleClick}>
            SignOut
        </button>
    )
}

export default SignOutButton