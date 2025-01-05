import express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { authenticateToken, authorizeRole } from "./middleware";
import { BCRYPT_SALT_ROUNDS, JWT_SECRET_KEY } from "./config";
import { User, Role, UserPayload } from "./types";

const app = express();

app.use(express.json());

const users: User[] = [
  {
    username: "admin",
    password: "$2a$10$ff73dnaIgUgykn.8jxs5DOY.RTfWZzxrV5B9YicrkyrDStDWTwhgy",
    role: Role.ADMIN,
  },
];

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  users.push({ username, password: hashedPassword, role: Role.USER });

  res.status(201).json({ message: "User created successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Incorrect username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect username or password" });
  }

  const payload: UserPayload = { username: user.username, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "8h" });

  return res.status(200).send({ message: "Login successful", token });
});

app.get("/users", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.get("/dashboard", authenticateToken, authorizeRole(Role.USER), (req, res) => {
  res.send({ message: `Welcome to the dashboard, ${req.user.username}` });
});

app.get("/dashboard/admin", authenticateToken, authorizeRole(Role.ADMIN), (req, res) => {
  res.send({ message: `Welcome to the admin dashboard, ${req.user.username}` });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
