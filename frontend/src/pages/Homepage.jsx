import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const { fetchUsers, connectSocket, disconnectSocket } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser?._id) return;
    connectSocket(authUser._id);
    fetchUsers();

    return () => disconnectSocket();
  }, [authUser?._id]);

  return (
    <div className={styles.container}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Homepage;
