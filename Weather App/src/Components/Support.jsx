import { useState } from "react";
import Navbar from "./Navbar";
import "./Support.css";

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus("⚠️ Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("✅ Feedback submitted successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const err = await res.json();
        setStatus(`❌ Error: ${err.message || "Failed to submit feedback"}`);
      }
    } catch (err) {
      console.error("Submit feedback error:", err);
      setStatus("❌ Failed to submit feedback.");
    }
  };

  return (
    <div className="support-page">
      <Navbar />
      <div className="support-content">
        <h2>Support / Feedback Form</h2>
        <form className="support-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Submit Feedback</button>
        </form>
        {status && <p className="status-msg">{status}</p>}
      </div>
    </div>
  );
}
