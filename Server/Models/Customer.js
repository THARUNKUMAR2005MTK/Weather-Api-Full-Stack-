const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const favouriteSchema = new mongoose.Schema({
  place: { type: String, required: true },   // e.g. "Chennai"
  latitude: { type: Number, required: true }, // e.g. 13.0827
  longitude: { type: Number, required: true } // e.g. 80.2707
});

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourites: [favouriteSchema]  // <-- Array of saved places
  },
  { collection: "Customer" }
);

// Hash password before saving
customerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // 10 = salt rounds
  }
  next();
});

module.exports = mongoose.model("Customer", customerSchema);
