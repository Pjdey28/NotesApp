const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models.js");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

router.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await User.create({ email: req.body.email, password: hashed });
    res.status(201).json({ message: "Registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });
    if (!JWT_SECRET) return res.status(500).json({ msg: "Server misconfigured" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
