const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = "Authorization";
const JWT_SECRET_KEY = "secret123";
const JWT_EXPIRE_TIME = "1h";

class Session {
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE_TIME });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET_KEY);
    } catch (err) {
      return null;
    }
  }

  destroy(req, res) {
    req.session = null;
  }
}

const sessions = new Session();

app.use((req, res, next) => {
  const token = req.get(SESSION_KEY);

  if (token) {
    const decoded = sessions.verifyToken(token);
    if (decoded) {
      req.session = decoded;
    }
  }

  next();
});

app.get("/", (req, res) => {
  if (req.session && req.session.username) {
    return res.json({
      username: req.session.username,
      logout: "http://localhost:3000/logout",
    });
  }
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/logout", (req, res) => {
  sessions.destroy(req, res);
  res.redirect("/");
});

const users = [
  {
    login: "Login",
    password: "Password",
    username: "Username",
  },
  {
    login: "Login1",
    password: "Password1",
    username: "Username1",
  },
];

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const user = users.find((user) => {
    return user.login == login && user.password == password;
  });

  if (user) {
    const token = sessions.generateToken({ username: user.username });
    res.json({ token });
  }

  res.status(401).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
