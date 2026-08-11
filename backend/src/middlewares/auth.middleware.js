const jwt = require("jsonwebtoken");

// Kisi bhi logged-in user (chahe role 'user' ho ya 'artist') ke liye
function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    // Token verify karo — agar valid hai to decoded data milega (id, role)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // is request ke sath user info attach kar do
    next(); // aage badho, actual route function chalao
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

// Sirf 'artist' role ke liye
function authArtist(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "Forbidden - Artists only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

module.exports = { authUser, authArtist };
