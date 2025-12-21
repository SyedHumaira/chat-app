// backend/src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://best-buddy-7vdd.onrender.com/api", // backend base URL
  withCredentials: true, // send cookies automatically
});

export default axiosInstance;
// end of backend/src/lib/axios.js