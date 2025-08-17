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
const supportRoutes = require("./Routes/support");
app.use("/api/customers", customerRoutes);
app.use("/api/support", supportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
