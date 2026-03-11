import { createContext, useContext } from "react";

export const AppContext = createContext({
    userData: {
        userId: "",
        username: "",
        isAccountVerified: false
    },
    setUserData: () => { },
    loading: false,
    setLoading: () => { }
})

export const useAppContext = () => useContext(AppContext)
