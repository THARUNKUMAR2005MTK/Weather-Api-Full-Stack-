import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // custom styles

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customers/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("customer", res.data.customer._id);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setMessage("❌ " + res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("⚠️ Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Customer Login</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
