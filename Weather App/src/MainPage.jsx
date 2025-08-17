import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import "./MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="weather-app-container">
      <Navbar />
      
      <div className="weather-hero">
        <div className="hero-content">
          <h1>Your Personal Weather Companion</h1>
          <p className="hero-description">
            Get accurate, real-time weather forecasts for any location worldwide.
            Plan your days with confidence using our reliable weather data.
          </p>
          <button 
            className="get-started-btn"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="weather-features">
        <div className="feature-card">
          <div className="feature-icon">🌡️</div>
          <h3>Real-Time Data</h3>
          <p>Up-to-the-minute temperature, humidity, and conditions</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Location Tracking</h3>
          <p>Get forecasts for your current location automatically</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⏳</div>
          <h3>Hourly Forecasts</h3>
          <p>Plan your day with detailed hourly predictions</p>
        </div>
      </div>
    </div>
  );
}