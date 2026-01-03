require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Mongo connected');
}).catch(err => {
  console.error('Mongo connection error:', err);
  process.exit(1);
});
app.use(cors());
app.use(express.json());
const auth = require("./routes/auth");
const note = require("./routes/notes");

app.use("/api/auth", auth);
app.use("/api/notes", note);
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ msg: err.message || 'Server error' });
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

