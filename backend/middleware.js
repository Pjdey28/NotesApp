const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.id;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
