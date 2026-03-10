import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../util/axiosConfig";

const AppContext = createContext({
    userData: {
        userId: "",
        username: "",
        isAccountVerified: false
    },
    setUserData: () => { },
    getUserData: async () => { },
    loading: false,
    setLoading: () => { }
})

export const AppContextProvider = ({ children }) => {
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const getUserData = async () => {
        setLoading(true)

        try {
            const response = await api.get(
                "/profile",
            )
            console.log("user: " + JSON.stringify(response.data));


            setUserData(response.data)
            return response.data
        }
        catch (ex) {
            if (ex.response) {
                toast.error(ex.response.message)
            }
            else {
                toast.error("Network error")
            }
        }
        finally {
            setLoading(false)
        }
    }

    const contextValue = {
        userData, setUserData,
        getUserData,
        loading, setLoading
    }

    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,

            async (error) => {
                console.log("found error");

                if (error.response?.status === 401) {
                    setUserData({});
                    toast.error("Session expired. Please login again.");
                    navigate("/login");
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
