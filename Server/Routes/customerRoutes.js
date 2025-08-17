const express = require("express");
const Customer = require("../Models/Customer");
const bcrypt = require("bcryptjs");

const router = express.Router();

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

module.exports = router;
