const express = require("express");
const { Note } = require("../models"); 
const auth = require("../middleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description || !req.user) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const note = await Note.create({
      title,
      description,
      user: req.user
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("NOTE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ user: req.user });
  res.json(notes);
});

router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
