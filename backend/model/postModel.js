const { default: mongoose } = require("mongoose");

// models/User.js
const postSchema = new mongoose.Schema({
  //   id: { type: Number, required: true },
  title: { type: String, unique: true },
  description: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
