const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Customer weather history schema
const historySchema = new mongoose.Schema({
  place: { type: String, required: true },   // e.g., "Chennai"
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  temp: { type: Number, required: true },
  humidity: { type: Number, required: true },
  condition: { type: String, required: true },  // when the data was recorded
},
{ timestamps: true }
);

// Favourite schema (unchanged)
const favouriteSchema = new mongoose.Schema({
  place: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

// Customer schema
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourites: [favouriteSchema],   // array of favourite places
    history: [historySchema]         // array of customer weather history
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
