// frontend/src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await signup(formData);
  if (success) navigate("/");
};


  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[580px] bg-[#020617] rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – SIGNUP FORM */}
        <div className="flex flex-col justify-center px-10">
          <div className="mb-8">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              💬
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Create an account
            </h2>
            <p className="text-gray-400 text-sm">
              Start chatting with your friends
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <div className="relative mt-1">
                <HiOutlineUser className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#020617] border border-gray-700 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <div className="relative mt-1">
                <HiOutlineMail className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#020617] border border-gray-700 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400">Password</label>
              <div className="relative mt-1">
                <HiOutlineLockClosed className="absolute top-3 left-3 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#020617] border border-gray-700 rounded-md py-2 pl-10 pr-10 text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 text-sm"
                >
                  👁
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-indigo-500 hover:bg-indigo-600 transition rounded-md py-2 text-white font-medium"
            >
              {isSigningUp ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* RIGHT – INFO PANEL */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[#020617] border-l border-gray-800">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-indigo-500/20 rounded-lg"
              />
            ))}
          </div>

          <h3 className="text-white text-xl font-semibold">
            Join the conversation
          </h3>
          <p className="text-gray-400 text-sm text-center mt-2 px-10">
            Create an account to start chatting with people you care about.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
// end of frontend/src/pages/SignupPage.jsx