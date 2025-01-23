const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("../config/database");
const User = require("../models/user");
const Task = require("../models/task");
const validator = require("validator");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(bodyParser.json());

async function verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password)
}


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite chaque IP à 5 requêtes par fenêtre de 15 minutes
    message: { error: "Too many failed login attempts, please try again later" }
});

console.log("loginLimiter", loginLimiter);

app.post("/auth", loginLimiter, async (req, res) => {
    const { email, password } = req.body
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ error: "Invalid input" });
    }
    try {
        let user = await User.findOne({ where: { email } })
        if (user) {
            const isPasswordValid = await verifyPassword(user, password)
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" })
            }
        } else {
            user = await User.create({ email, password })
        }
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/task", async (req, res) => {
    const { title, description, userId } = req.body;
    if (!title || !userId) {
        return res.status(400).json({ error: "Title and userId are required" });
    }
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const task = await Task.create({ title, description, userId });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/task/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



describe("API Routes", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(() => {
        // Réinitialiser le stockage du middleware rate-limit
        loginLimiter.resetKey("::ffff:127.0.0.1");
    });


    // TESTS UNITAIRES //

    // test de création d'un nouvel utilisateur
    test("POST /auth - create a new user", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ email: "test@example.com", password: "password123" });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("email", "test@example.com");
        expect(response.body).toHaveProperty("id");
    });

    //test de connexion d'un utilisateur
    test("POST /auth - login user", async () => {
        const user = await User.findOne({ where: { email: "test@example.com" } });
        expect(user).not.toBeNull();
    
        const response = await request(app)
            .post("/auth")
            .send({ email: "test@example.com", password: "password123" });
            
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("email", user.email);
    });

    // test de création d'une nouvelle tâche
    test("POST /task - create a new task", async () => {
        const user = await User.create({ email: "testtask@example.com", password: "password123" });
        const response = await request(app)
            .post("/task")
            .send({ title: "Test Create Task", userId: user.id });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("userId", user.id);
        expect(response.body).toHaveProperty("title", "Test Create Task");
    });

    // test de récupération de toutes les tâches
    test("GET /tasks - get all tasks", async () => {
        const response = await request(app).get("/tasks");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // test de récupération d'une tâche par son identifiant
    test("GET /task/:id - get task by id", async () => {
        const user = await User.create({ email: "testuser@example.com", password: "password123" });
        const task = await Task.create({ title: "Test Task", description: "Test Description", userId: user.id });
        const response = await request(app).get(`/task/${task.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("title", "Test Task");
    });


    // TEST SECURITAIRES //

    // test d'injection SQL
    test("POST /auth - prevent SQL injection", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ email: "' OR 1=1; --", password: "password123" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    // Test de XSS
    test("POST /auth - prevent XSS", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ email: "<script>alert('XSS')</script>", password: "password123" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    // Test d'hachage mdp
    test("POST /auth - password should be hashed", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ email: "secure@example.com", password: "password123" });
        expect(response.statusCode).toBe(201);
        const user = await User.findOne({ where: { email: "secure@example.com" } });
        expect(user.password).not.toBe("password123");
    });

    // Test de protection contre les attaques par force brute
    test("POST /auth - prevent brute force attacks", async () => {
        for (let i = 0; i < 6; i++) {
            const response = await request(app)
                .post("/auth")
                .send({ email: "secure@example.com", password: "wrongpassword" });
            console.log(response);
            if (i < 5) {
                expect(response.statusCode).toBe(401);
                expect(response.body).toHaveProperty("error", "Invalid password");
            } else {
                expect(response.statusCode).toBe(429);
                expect(response.body).toHaveProperty("error", "Too many failed login attempts, please try again later");
            }
        }
    });


    // TESTS FONCTIONNELS //

    // test("PUT /task/:id - update a task", async () => {
    //     const user = await User.create({ email: "updateuser@example.com", password: "password123" });
    //     const task = await Task.create({ title: "Old Task", description: "Old Description", userId: user.id });
    //     const response = await request(app)
    //         .put(`/task/${task.id}`)
    //         .send({ title: "Updated Task", description: "Updated Description" });
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty("title", "Updated Task");
    //     expect(response.body).toHaveProperty("description", "Updated Description");
    // });

    // // test de suppression d'une tâche
    // test("DELETE /task/:id - delete a task", async () => {
    //     const user = await User.create({ email: "deleteuser@example.com", password: "password123" });
    //     const task = await Task.create({ title: "Task to Delete", description: "Description", userId: user.id });
    //     const response = await request(app).delete(`/task/${task.id}`);
    //     expect(response.statusCode).toBe(204);
    //     const deletedTask = await Task.findByPk(task.id);
    //     expect(deletedTask).toBeNull();
    // });
});