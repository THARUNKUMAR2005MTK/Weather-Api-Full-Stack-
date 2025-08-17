const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
// Connect DB
connectDB();

// Routes
const customerRoutes = require("./Routes/customerRoutes");
app.use("/api/customers", customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
