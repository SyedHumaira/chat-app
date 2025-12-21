// frontend/src/lib/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
  withCredentials: true,
  autoConnect: false, // IMPORTANT
});

export default socket;
// end of frontend/src/lib/socket.js