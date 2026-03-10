import { useAppContext } from "../context/AppContext"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    const { loading, userData } = useAppContext()

    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                Loading...
            </div>
        )
    }

    if (!userData?.username) {
        return <Navigate to="/login" state={{ message: "Please login first" }} replace />
    }
    if (userData?.isAccountVerified) {
        return <Navigate to="/" state={{ message: "Your email is already verified" }} replace />
    }

    return <Outlet />
}

export const PublicRoute = () => {
    const { userData, loading } = useAppContext()

    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                Loading...
            </div>
        )
    }

    if (userData?.username) {
        return <Navigate to="/" state={{ message: "Already logged in" }} replace />
    }

    return <Outlet />
}