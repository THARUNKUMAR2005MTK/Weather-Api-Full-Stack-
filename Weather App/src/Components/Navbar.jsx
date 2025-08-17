import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [customer, setCustomer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      setCustomer(storedCustomer);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    setCustomer(null);
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">Weather App</h1>
          <div className="navbar-links">
            {/* Menu button - visible on all screens */}
            <button className="menu-btn" onClick={toggleSidebar}>
              <span className="menu-icon">☰</span>
              <span className="menu-text">Menu</span>
            </button>

            {/* About link - visible on all screens */}
            <a href="#about" className="nav-link">
              About
            </a>

            {/* Login/Logout - visible on all screens */}
            {customer ? (
              <button onClick={handleLogout} className="nav-link">
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <div className="sidebar-links">
          <Link to="/" onClick={toggleSidebar} className="sidebar-link">
            Home
          </Link>
          <Link to="/dashboard" onClick={toggleSidebar} className="sidebar-link">
            Dashboard
          </Link>
          <Link to="/profile" onClick={toggleSidebar} className="sidebar-link">
            Profile
          </Link>
          <Link to="/favourites" onClick={toggleSidebar} className="sidebar-link">
            Favourites
          </Link>
          <Link to="/history" onClick={toggleSidebar} className="sidebar-link">
            History
          </Link>
          <Link to="/support" onClick={toggleSidebar} className="sidebar-link">
            Support
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
}