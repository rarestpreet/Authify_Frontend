import api from "../util/axiosConfig.js"
import {useNavigate} from "react-router-dom"
import {useState, useEffect} from "react"
import {AppContext} from "../context/AppContext.js";
import handleSessionStorage from "../services/handleSessionStorage.js";
import apiMethod from "../services/api.js";
import handleToast from "../util/toast.js";

const AppContextProvider = ({children}) => {
    const storedUserData = handleSessionStorage.getUserProfile_Session()

    const [userData, setUserData] = useState(storedUserData || {})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()



    const contextValue = {
        userData, setUserData,
        loading, setLoading
    }

    useEffect(() => {
        apiMethod.getUserData(setLoading, setUserData)
    }, [])

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,

            async (error) => {
                if (error.response?.status === 401) {
                    handleSessionStorage.clearUserProfile_Session()
                    setUserData({})
                    handleToast.notifyError("Session expired. Please login again.")
                    navigate("/login")
                }

                return Promise.reject(error)
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor)
        }
    }, [navigate])

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider