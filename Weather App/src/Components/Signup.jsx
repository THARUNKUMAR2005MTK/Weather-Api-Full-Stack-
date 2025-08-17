import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customers/signup", formData);
      setMessage(res.data.message || "Signup successful ✅");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error signing up");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px", gap: "10px" }}>
        <h2>Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Signup</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
