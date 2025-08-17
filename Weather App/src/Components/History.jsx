import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaTemperatureHigh, FaTint, FaCloud, FaMapMarkerAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./History.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const navigate = useNavigate();
  const containerRef = useRef();

  useEffect(() => {
    const customerId = localStorage.getItem("customer");
    if (!customerId) {
      alert("⚠️ You must log in to view history.");
      navigate("/");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/customers/fetchhistory/${customerId}`
        );
        const data = await res.json();
        setHistory(data.history || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch history error:", err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handlePrintPDF = () => {
    if (!containerRef.current) return;

    html2canvas(containerRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`WeatherHistory_${viewMode}.pdf`);
    });
  };

  if (loading) return <p>Loading history...</p>;
  if (history.length === 0) return <p>No history found.</p>;

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-content">
        <h2>Your Weather History</h2>

        <div className="history-controls">
          <button
            className={viewMode === "cards" ? "active" : ""}
            onClick={() => setViewMode("cards")}
          >
            Card View
          </button>
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button className="pdf-btn" onClick={handlePrintPDF}>
            📄 Generate PDF
          </button>
        </div>

        <div ref={containerRef}>
          {viewMode === "cards" ? (
            <div className="history-grid">
              {history.map((entry, idx) => (
                <div className="history-card" key={idx}>
                  <h3>{entry.place}</h3>
                  <p>
                    <FaMapMarkerAlt /> Lat: {entry.latitude.toFixed(2)}, Lon:{" "}
                    {entry.longitude.toFixed(2)}
                  </p>
                  <p>
                    <FaTemperatureHigh /> Temp: {entry.temp}°C
                  </p>
                  <p>
                    <FaTint /> Humidity: {entry.humidity}%
                  </p>
                  <p>
                    <FaCloud /> Condition: {entry.condition}
                  </p>
                  <p>
                    <strong>Checked at:</strong>{" "}
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Condition</th>
                    <th>Checked At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.place}</td>
                      <td>{entry.latitude.toFixed(2)}</td>
                      <td>{entry.longitude.toFixed(2)}</td>
                      <td>{entry.temp}</td>
                      <td>{entry.humidity}</td>
                      <td>{entry.condition}</td>
                      <td>{new Date(entry.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
