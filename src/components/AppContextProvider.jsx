import { toast } from "react-toastify"
import api from "../util/axiosConfig"
import { useNavigate } from "react-router-dom"
import {useState, useEffect} from "react"
import {AppContext} from "./AppContext.js";

const AppContextProvider = ({ children }) => {

    const [userData, setUserData] = useState({
        userId: "",
        username: "",
        isAccountVerified: false
    })
    const [isLogged, setIsLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const getUserData = async () => {
        setLoading(true)

        try {
            const response = await api.get(
                "/profile",
            )

            sessionStorage.setItem("userData", JSON.stringify(response.data))
            setUserData(response.data)
            return response.data
        }
        catch (ex) {
            console.log(ex)

            const msg = ex.response?.data?.message || "Network error"
            toast.error(msg)
        }
        finally {
            setLoading(false)
        }
    }

    const contextValue = {
        userData, setUserData,
        getUserData,
        loading, setLoading,
        isLogged, setIsLogged
    }

    useEffect(() => {
        if (isLogged) {
            getUserData()
        }
    }, [isLogged])

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,

            async (error) => {

                if (error.response?.status === 401) {
                    setUserData({});
                    toast.error("Session expired. Please login again.");
                    navigate("/login");
                }
                setIsLogged(false);

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider