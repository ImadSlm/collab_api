const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("../config/database");
const User = require("../models/user");
const Task = require("../models/task");
const app = express();

app.use(bodyParser.json());

app.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
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

    test("POST /auth - create a new user", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ email: "test@example.com", password: "password123" });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("email", "test@example.com");
        expect(response.body).toHaveProperty("id");
    });

    test("GET /tasks - get all tasks", async () => {
        const response = await request(app).get("/tasks");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /task/:id - get task by id", async () => {
        const user = await User.create({ email: "testuser@example.com", password: "password123" });
        const task = await Task.create({ title: "Test Task", description: "Test Description", userId: user.id });
        const response = await request(app).get(`/task/${task.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("title", "Test Task");
    });
});