import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaTemperatureHigh, FaTint, FaCloud, FaStar } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Dashboard.css";

// Fix Leaflet marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_KEY = "8987f0ac66e36030e709146c8ace1f98";

function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [historySaved, setHistorySaved] = useState(false);

  const navigate = useNavigate();

  // Check login
  useEffect(() => {
    const customerId = localStorage.getItem("customer");
    if (!customerId) {
      alert("⚠️ You must log in to access the dashboard.");
      navigate("/");
    }
  }, [navigate]);

  // Save weather to history (backend)
  const saveHistory = async (weatherData, locationData) => {
    const customerId = localStorage.getItem("customer");
    if (!customerId || !weatherData || !locationData) return;

    const historyEntry = {
      place: weatherData.name,
      latitude: locationData.lat,
      longitude: locationData.lon,
      temp: weatherData.temp,
      humidity: weatherData.humidity,
      condition: weatherData.condition,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/addHistory/${customerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(historyEntry),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        console.error("Add history failed:", err.message || "Error");
      }
    } catch (err) {
      console.error("Add history error:", err);
    }
  };

  // Fetch weather for a given location
  const fetchWeather = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (data.cod === 200) {
      const weatherData = {
        name: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        condition: data.weather[0].description,
      };
      setWeather(weatherData);

      // ✅ Always save history after fetching weather
      saveHistory(weatherData, { lat, lon });
    } else {
      setWeather(null);
    }
  } catch (err) {
    console.error("Weather fetch error:", err);
  }
};

  // Detect current location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLocation(coords);
        setHistorySaved(false); // reset for new location
        fetchWeather(coords.lat, coords.lon);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  // Refetch weather when location changes
  useEffect(() => {
    if (location) {
      setHistorySaved(false); // reset for new location
      fetchWeather(location.lat, location.lon);
    }
  }, [location]);

  // Fetch city suggestions
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  // Select a suggested city
  const handleSelectSuggestion = (city) => {
    setSearchQuery(city.name);
    setSuggestions([]);
    setLocation({ lat: city.lat, lon: city.lon });
  };

  // Add to favourites
  const handleAddFavourite = async () => {
    const customerId = localStorage.getItem("customer");
    if (!customerId || !location || !weather) {
      alert("⚠️ Missing customer, location, or weather data.");
      return;
    }

    const favouriteData = {
      place: weather.name,
      latitude: location.lat,
      longitude: location.lon,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/AddFavourite/${customerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(favouriteData),
        }
      );
      if (res.ok) alert("✅ Location added to favourites!");
      else {
        const err = await res.json();
        alert(`❌ Failed: ${err.message || "Error"}`);
      }
    } catch (err) {
      console.error("Add Favourite Error:", err);
      alert("❌ Could not add favourite.");
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h1>Weather Dashboard</h1>

        {weather ? (
          <div className="weather-card">
            <h2>{weather.name}</h2>
            <p>
              <FaTemperatureHigh /> Temperature: {weather.temp}°C
            </p>
            <p>
              <FaTint /> Humidity: {weather.humidity}%
            </p>
            <p>
              <FaCloud /> Condition: {weather.condition}
            </p>
            <button className="favourite-btn" onClick={handleAddFavourite}>
              <FaStar /> Add to Favourites
            </button>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search city"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchSuggestions(e.target.value);
            }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((city, idx) => (
                <li key={idx} onClick={() => handleSelectSuggestion(city)}>
                  {city.name}, {city.state || ""} {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="map-toggle-btn" onClick={() => setShowMap(!showMap)}>
          {showMap ? "Hide Map" : "Pick Location on Map"}
        </button>

        {showMap && (
          <div className="map-container">
            <MapContainer
              center={[location?.lat || 20, location?.lon || 78]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {location && <Marker position={[location.lat, location.lon]} />}
              <LocationMarker setLocation={setLocation} />
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
