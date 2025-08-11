import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Profile from "./components/Profile";
import Favourites from "./components/Favourites";
import History from "./components/History";
import Support from "./components/Support";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/history" element={<History />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}
