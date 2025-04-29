const express = require("express");
const dotenv = require("dotenv");
const users = require("./users");
const jwt = require("jsonwebtoken");
const { getAuthUser, checkUserRole } = require("./middlewares/auth");

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.email === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  res.json({ access_token: token, token_type: "Bearer" });
});

app.use(getAuthUser);

const PORT = process.env.PORT || 3001;

app.get("/me", (req, res) => {
  const authUser = req.authUser;
  return res.json(users.find((user) => user.email === authUser.email));
});

app.use(checkUserRole("admin"));

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
