const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const NoteSchema = new mongoose.Schema({
  title: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
const Note = mongoose.model("Note", NoteSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { Note, User };