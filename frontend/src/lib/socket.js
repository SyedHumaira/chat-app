// frontend/src/lib/socket.js
import { io } from "socket.io-client";

const socket = io("https://best-buddy-7vdd.onrender.com", {
  withCredentials: true,
  autoConnect: false, // IMPORTANT
});

export default socket;
// end of frontend/src/lib/socket.js