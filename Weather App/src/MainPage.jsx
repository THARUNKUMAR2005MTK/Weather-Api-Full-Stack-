import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import "./MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar with sidebar already inside */}
      <Navbar />

      {/* Centered Welcome Section */}
      <main className="main-content center-content">
        <h2>Welcome to Weather App</h2>
        <p>Check the latest weather and manage your favourites & history.</p>
        <button className="go-btn" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </main>
    </div>
  );
}
