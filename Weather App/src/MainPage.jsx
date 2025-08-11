import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MainPage.css";

export default function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Weather App</h1>
        <div className="navbar-links">
          <button className="menu-btn" onClick={toggleSidebar}>
            Menu
          </button>
          <a href="#about" className="nav-link">
            About
          </a>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <Link to="/" onClick={toggleSidebar}>Home</Link>
        <Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link>
        <Link to="/profile" onClick={toggleSidebar}>Profile</Link>
        <Link to="/favourites" onClick={toggleSidebar}>Favourites</Link>
        <Link to="/history" onClick={toggleSidebar}>History</Link>
        <Link to="/support" onClick={toggleSidebar}>Support</Link>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

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
