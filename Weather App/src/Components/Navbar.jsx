import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Navbar() {
  const [customer, setCustomer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Check localStorage on load
  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      setCustomer(storedCustomer);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer"); // clear session
    setCustomer(null);
    navigate("/"); // redirect to home after logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
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
    </>
  );
}
