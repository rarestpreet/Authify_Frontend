import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import handleToast from "../util/toast.js"

export const useRouteToast = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const lastMessageRef = useRef(null)

    useEffect(() => {
        const message = location.state?.message
        const fromLogin = location.state?.fromLogin

        if (fromLogin) {
            navigate(location.pathname, { replace: true })
            return
        }

        if (message) {
            if (message !== lastMessageRef.current) {
                lastMessageRef.current = message
                handleToast.notifyInfo(message)
            }
            navigate(location.pathname, { replace: true })
        } else {
            lastMessageRef.current = null
        }
    }, [location.state?.message, location.state?.fromLogin, location.pathname, navigate])
}

