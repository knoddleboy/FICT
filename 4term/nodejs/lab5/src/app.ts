/**
 * В Node.js з допомогою фреймворка Express напишіть на Typescript веб-сервер, який відповідатиме
 * стандартам REST і реалізовуватиме базові операції CRUD для сутності user (користувач) із полями
 * id, username та name:
 *  - зробіть ендпоінт "створення користувача" з бов'язковим параметром username і необов'язковим
 *    параметром name;
 *  - зробіть ендпоінт "отримання даних користувача за його id" (id + username + name);
 *  - зробіть ендпоінт "список користувачів" (список записів id + username + name);
 *  - зробіть ендпоінт "оновлення даних користувача за його id";
 *  - зробіть ендпоінт "видалення користувача за його id";
 *  - не використовуйте баз даних, зберігайте дані локально в пам'яті процесу або у файловій системі.
 */

import express, { type Request } from "express";
import { UserDatabase, type User } from "./userDb";

const userDb = new UserDatabase();

const app = express();
app.use(express.json());

// Create User endpoint
app.post("/users", (req: Request<{}, {}, Omit<User, "id">>, res) => {
    const { username, name } = req.body;

    if (!username) {
        res.status(400).json({ error: "Username is required" });
        return;
    }

    userDb.addUser(username, name);

    res.status(201).json({ username, name });
});

// Get User by ID endpoint
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = userDb.getUserById(id);

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    res.json(user);
});

// List Users endpoint
app.get("/users", (req, res) => {
    res.json(userDb.getUsers());
});

// Update User by ID endpoint
app.put("/users/:id", (req: Request<{ id: string }, {}, Omit<User, "id">>, res) => {
    const id = parseInt(req.params.id);
    const { username, name } = req.body;

    // Check if username is valid
    if (!username || !/^[a-zA-Z0-9_]+$/.test(username)) {
        res.status(400).json({
            error: "Invalid username. Username can only contain letters, numbers and underscores",
        });
        return;
    }

    // Check if name is valid
    if (!name || !/^[a-zA-Z ]+$/.test(name)) {
        res.status(400).json({ error: "Invalid name. Name can only contain letters and spaces" });
        return;
    }

    const result = userDb.updateUser(id, username, name);

    if (result) {
        res.status(201).json({ message: "User successfully updated" });
    } else {
        res.status(400).json({ error: "User not found" });
    }
});

// Delete User by ID endpoint
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const result = userDb.deleteUser(id);

    if (result) {
        res.status(201).json({ message: "User successfully deleted" });
    } else {
        res.status(400).json({ error: "User not found" });
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
