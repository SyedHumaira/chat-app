// backend/src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // backend base URL
  withCredentials: true, // send cookies automatically
});

export default axiosInstance;
// end of backend/src/lib/axios.js