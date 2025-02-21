import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch user details on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const emailCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("email="));

        if (!emailCookie) {
          setError("User email not found. Please log in.");
          return;
        }

        const email = decodeURIComponent(emailCookie.split("=")[1]);
        const response = await fetch(`http://localhost:3000/api/user?email=${email}`);

        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        setUser({ name: data.name, email: data.email, password: "" });
        setUserId(data.userId);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/user/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 mx-64 bg-white rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">New Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
