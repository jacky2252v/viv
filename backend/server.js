require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./model/userModel");
const postModel = require("./model/postModel");

const app = express();
const port = 4000;
app.use(express.json());

const dbURI = process.env.MONGODB_URI;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("Connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Users API

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user && password) {
    res.json({ message: "Login successful", user: { email: user.email } });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/users", async (req, res) => {
  const user = new userModel(req.body);
  console.log(user);
  await user.save();
  res.status(201).send(user);
});

app.get("/users", async (req, res) => {
  const users = await userModel.find();
  res.send(users);
});

app.delete("/users/:id", async (req, res) => {
  console.log("req", req.params.id);
  await userModel.findByIdAndDelete(req.params.id);

  res.send({ message: "User deleted" });
});

app.patch("/users/:id", async (req, res) => {
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(user);
});

// Posts API

app.post("/posts", async (req, res) => {
  const post = new postModel(req.body);
  await post.save();
  res.status(201).send(post);
});

app.get("/posts", async (req, res) => {
  const posts = await postModel.find();
  res.send(posts);
});

app.get("/posts/:id", async (req, res) => {
  const post = await postModel.findById(req.params.id);
  res.send(post);
});

app.delete("/posts/:id", async (req, res) => {
  await postModel.findByIdAndDelete(req.params.id);
  res.send({ message: "Post deleted" });
});

app.patch("/posts/:id", async (req, res) => {
  const post = await postModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(post);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
