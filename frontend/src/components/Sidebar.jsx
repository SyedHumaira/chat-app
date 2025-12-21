import { useChatStore } from "../store/useChatStore";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { users, selectUser, onlineUsers, selectedUser } = useChatStore();

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>Contacts</div>
      <div className={styles.userList}>
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isActive = selectedUser?._id === user._id;

          return (
            <div
              key={user._id}
              onClick={() => selectUser(user)}
              className={`${styles.userItem} ${isActive ? styles.active : ""}`}
            >
              <div className={styles.avatarWrapper}>
                <img
                  src={user.profilePic || "https://via.placeholder.com/36"}
                  alt={user.fullName}
                  className={styles.avatar}
                />
                {isOnline && <span className={styles.onlineDot} />}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.fullName}</span>
                {user.lastMessage && (
                  <span className={styles.lastMessage}>
                    {user.lastMessage.text}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
