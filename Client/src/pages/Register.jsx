import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.status === 400) {
        setError("User already exists or invalid data");
      } else if (response.ok) {
        navigate("/login"); // Redirect after successful registration
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#132a13] via-[#204c2d] to-[#31572c] p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20">
          <div className="text-center">
            <img src={logo} alt="Company Logo" className="mx-auto h-20 w-auto" />
            <h2 className="mt-6 text-2xl font-bold text-white">Register</h2>
          </div>
  
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg bg-white/20 px-4 py-2 text-[#ecf39e] placeholder-[#90a955] focus:outline-none focus:ring-2 focus:ring-[#ecf39e]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-lg bg-white/20 px-4 py-2 text-[#ecf39e] placeholder-[#90a955] focus:outline-none focus:ring-2 focus:ring-[#ecf39e]"
              />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-lg bg-white/20 px-4 py-2 text-[#ecf39e] placeholder-[#90a955] focus:outline-none focus:ring-2 focus:ring-[#ecf39e]"
              />
            </div>
  
            <button
              type="submit"
              className="w-full mt-4 py-2 bg-[#ecf39e] text-[#132a13] font-semibold rounded-lg shadow-md hover:bg-[#d8e16d] transition-all duration-200"
            >
             Register
            </button>
          </form>
  
          <div className="mt-4 text-center text-sm text-white">
            <p>Not a member? <a href="/login" className="text-[#ecf39e] hover:underline">Login</a></p>
          </div>
  
          {error && (
            <div className="mt-4 flex items-center justify-center rounded-lg bg-red-100 px-4 py-2 text-red-700 border border-red-400 shadow-md">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>
    );
}
