import axios from "axios";
import { AppConstants } from "./constants";

const api = axios.create({
    baseURL: AppConstants.BACKEND_URL,
    withCredentials: true
});

export default api;