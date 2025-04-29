const jwt = require("jsonwebtoken");

const getAuthUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  const tokenWithoutBearer = token.split(" ")[1];
  // Verify the token
  try {
    console.log(process.env.JWT_SECRET);
    const authUser = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.authUser = authUser;
    next();
  } catch (e) {
    return res.status(401).json({ message: `No autorizado ${e}` });
  }
};

const checkUserRole = (role) => (req, res, next) => {
  console.log("Role", role);
  const authUser = req.authUser;
  if (authUser.role !== role)
    return res.status(401).json({ message: "No autorizado" });
  next();
};

module.exports = { getAuthUser, checkUserRole };
