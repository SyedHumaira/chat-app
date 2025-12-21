// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser } from "react-icons/hi";

const ProfilePage = () => {
  const { authUser, setAuthUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authUser) navigate("/login"); // protect route
  }, [authUser, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!profilePic) return alert("Please select an image");
    try {
      setIsUpdating(true);
      const res = await axiosInstance.put("/auth/update-profile", {
        profilePic,
      });
      setAuthUser(res.data); // update Zustand state
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {authUser && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
          <div className="flex flex-col items-center space-y-4">
            <img
              src={authUser.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold">{authUser.fullName}</h3>
            <p className="text-gray-500">{authUser.email}</p>
          </div>

          {/* Update Profile Pic */}
          <form className="mt-6 space-y-4" onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label">Profile Picture URL</label>
              <input
                type="text"
                placeholder="Enter image URL"
                className="input input-bordered w-full"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <button className="btn btn-outline w-full mt-4" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
// end of src/pages/ProfilePage.jsx
