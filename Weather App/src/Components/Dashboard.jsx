import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Dashboard.css"; // optional, you can style later

// ✅ Fix Leaflet marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_KEY = "8987f0ac66e36030e709146c8ace1f98"; // ⬅ replace with your real key

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

  // Fetch weather by coordinates
  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather({
          name: data.name,
          temp: data.main.temp,
          humidity: data.main.humidity,
          condition: data.weather[0].description,
        });
      } else {
        setWeather(null);
        alert("Weather not found for this location.");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  // Detect current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setLocation(coords);
        fetchWeather(coords.lat, coords.lon);
      },
      (err) => console.error(err)
    );
  }, []);

  // Update weather when location changes
  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location]);

  // Search by city name
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather({
          name: data.name,
          temp: data.main.temp,
          humidity: data.main.humidity,
          condition: data.weather[0].description,
        });
        setLocation({ lat: data.coord.lat, lon: data.coord.lon });
      } else {
        alert("City not found.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="dashboard" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Weather Dashboard</h1>

      {weather ? (
        <div className="weather-card" style={{ marginBottom: "20px" }}>
          <h2>{weather.name}</h2>
          <p>🌡 Temperature: {weather.temp}°C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>☁ Condition: {weather.condition}</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}

      {/* Search Box */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "200px", marginRight: "8px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 12px" }}>
          Search
        </button>
      </div>

      {/* Map Picker Toggle */}
      <button
        onClick={() => setShowMap(!showMap)}
        style={{ padding: "8px 12px", marginBottom: "15px" }}
      >
        {showMap ? "Hide Map" : "Pick Location on Map"}
      </button>

      {/* Map */}
      {showMap && (
        <div style={{ height: "400px", width: "100%", marginTop: "10px" }}>
          <MapContainer
            center={[location?.lat || 20, location?.lon || 78]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location && <Marker position={[location.lat, location.lon]} />}
            <LocationMarker setLocation={setLocation} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
