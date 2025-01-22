require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const sequelize = require("./config/database")
const User = require("./models/user")
const Task = require("./models/task")
const validator = require("validator");
const bcrypt = require("bcrypt")

const app = express()
app.use(bodyParser.json())
const port = 3000

// Création d'un utilisateur
app.post("/auth", async (req, res) => {
    const { email, password } = req.body
    if (!validator.isEmail(email) || !validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ error: "Invalid input" });
    }
    try {
        const user = await User.create({ email, password })
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
})

// Création d'une tâche
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

// Récupération de toutes les tâches
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll()
        res.status(200).json(tasks)
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
})

// Récupération d'une tâche à partir de son identifiant
app.get("/task/:id", async (req, res) => {
    const { id } = req.params
    try {
        const task = await Task.findByPk(id)
        if (task) {
            res.status(200).json(task)
        } else {
            res.status(404).json({ error : "Task not found" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})
