import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDashboardData = async () => {
   try {
    const res = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
    return res.data;
   } catch (error) {
    throw error.response?.data || { Message: "Failed to fetch dashboard data." };
   }
};

const progressService = { getDashboardData };
export default progressService;