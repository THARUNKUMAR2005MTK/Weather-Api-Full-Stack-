import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaTemperatureHigh, FaTint, FaCloud } from "react-icons/fa";
import "./Favourites.css";
import { AnimatePresence } from "framer-motion";

const API_KEY = "8987f0ac66e36030e709146c8ace1f98";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const customerId = localStorage.getItem("customer");
    if (!customerId) {
      alert("⚠️ You must log in to access Favourites.");
      navigate("/");
      return;
    }

    const fetchFavouritesWeather = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/customers/fetchfavourite/${customerId}`
        );
        const data = await res.json();
        const favs = data.favourites || [];

        if (favs.length === 0) {
          setFavourites([]);
          setLoading(false);
          return;
        }

        const weatherPromises = favs.map(async (fav) => {
          try {
            // Today (current weather)
            const currentRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&appid=${API_KEY}&units=metric`
            );
            const currentData = await currentRes.json();

            // Tomorrow forecast
            const oneCallRes = await fetch(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${fav.latitude}&lon=${fav.longitude}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`
            );
            const oneCallData = await oneCallRes.json();
            const tomorrow = oneCallData?.daily?.[1] || null;

            return {
              place: fav.place,
              today: currentData.main
                ? {
                    temp: currentData.main.temp,
                    humidity: currentData.main.humidity,
                    condition: currentData.weather?.[0]?.description || "N/A",
                  }
                : null,
              tomorrow: tomorrow
                ? {
                    temp: tomorrow.temp.day,
                    condition: tomorrow.weather?.[0]?.description || "N/A",
                  }
                : null,
            };
          } catch {
            return { place: fav.place, today: null, tomorrow: null };
          }
        });

        const results = await Promise.all(weatherPromises);
        setFavourites(results);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Favourites Error:", err);
        setLoading(false);
      }
    };

    fetchFavouritesWeather();
  }, [navigate]);

  if (loading)
    return (
      <div className="loading">
        <p>Fetching your favourite places...</p>
      </div>
    );

  return (
    <div className="favourites-page">
      <Navbar />
      <div className="favourites-content">
        <h2>Your Favourite Places</h2>
        {favourites.length === 0 ? (
          <p>No favourites found.</p>
        ) : (
          <div className="favourites-grid">
            <AnimatePresence>
              {favourites.map((fav, idx) => (
                <motion.div
                  className="fav-card"
                  key={fav.place}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  <h3>{fav.place}</h3>
                  <div className="weather-day">
                    <h4>Today</h4>
                    {fav.today ? (
                      <p>
                        <FaTemperatureHigh /> {fav.today.temp}°C,{" "}
                        <FaTint /> {fav.today.humidity}%,
                        <FaCloud /> {fav.today.condition}
                      </p>
                    ) : (
                      <p>Data not available</p>
                    )}
                  </div>
                  <div className="weather-day">
                    <h4>Tomorrow</h4>
                    {fav.tomorrow ? (
                      <p>
                        Temp: {fav.tomorrow.temp}°C, {fav.tomorrow.condition}
                      </p>
                    ) : (
                      <p>Data not available</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
