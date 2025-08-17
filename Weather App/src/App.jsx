import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import Favourites from "./Components/Favourites";
import History from "./Components/History";
import Support from "./Components/Support";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/history" element={<History />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}
