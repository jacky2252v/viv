const { default: mongoose } = require("mongoose");

// models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, unique: true },
  password: { type: String, unique: true },
});

module.exports = mongoose.model('User', userSchema);
