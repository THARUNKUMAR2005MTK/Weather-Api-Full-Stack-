const express = require("express");
const Customer = require("../Models/Customer");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = express.Router();
const API_KEY = "8987f0ac66e36030e709146c8ace1f98";

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Validation
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already registered ❌" });
    }

    // Save to DB
    const newCustomer = new Customer({ name, phone, email, password });
    await newCustomer.save();

    res.json({ message: "Customer signed up successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/AddFavourite/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { place, latitude, longitude } = req.body;

    if (!place || !latitude || !longitude) {
      return res.status(400).json({ message: "Place, latitude, and longitude are required" });
    }

    // Find customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Add new favourite
    customer.favourites.push({ place, latitude, longitude });
    await customer.save();

    res.json({ message: "Favourite added successfully", favourites: customer.favourites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetchfavourite/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    // ✅ Convert string to ObjectId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customerId" });
    }

    const objectId = new mongoose.Types.ObjectId(customerId);

    const customer = await Customer.findById(objectId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ favourites: customer.favourites });
  } catch (error) {
    console.error("FetchFavourite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetchWeatherForFavourites/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const favourites = customer.favourites || [];

    // Fetch weather for all favourites in parallel
    const weatherPromises = favourites.map(async (fav) => {
      try {
        // Current weather
        const resCurrent = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&appid=${API_KEY}&units=metric`
        );
        const currentData = await resCurrent.json();

        // Forecast (daily)
        const resOneCall = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${fav.latitude}&lon=${fav.longitude}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`
        );
        const oneCallData = await resOneCall.json();

        const tomorrow = oneCallData.daily?.[1]; // Tomorrow

        return {
          place: fav.place,
          current: {
            temp: currentData.main?.temp || 0,
            humidity: currentData.main?.humidity || 0,
            condition: currentData.weather?.[0]?.description || "N/A"
          },
          tomorrow: tomorrow
            ? {
                temp: tomorrow.temp.day,
                condition: tomorrow.weather[0].description
              }
            : null
        };
      } catch (err) {
        console.error("Weather fetch error for", fav.place, err);
        return { place: fav.place, current: null, tomorrow: null };
      }
    });

    const results = await Promise.all(weatherPromises);
    res.json({ favourites: results });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/addHistory/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { place, latitude, longitude, temp, humidity, condition } = req.body;

    if (!place || !latitude || !longitude || !temp || !humidity || !condition) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const historyEntry = { place, latitude, longitude, temp, humidity, condition };
    customer.history.push(historyEntry);
    await customer.save();

    res.status(200).json({ message: "History added successfully", historyEntry });
  } catch (err) {
    console.error("Add history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Fetch customer history
router.get("/fetchhistory/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const customer = await Customer.findById(customerId).select("history");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json({ history: customer.history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
