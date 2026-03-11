import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const useRouteToast = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.state?.message) {
            toast.info(location.state.message)
        }

        navigate(location.pathname, { replace: true })
    }, [location.state, location.pathname, navigate])

}

