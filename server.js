require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const sequelize = require("./config/database")
const User = require("./models/user")
const Task = require("./models/task")
const validator = require("validator")
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt")

const app = express()
app.use(bodyParser.json())
const port = 3000

// Fonction pour vérifier le mot de passe de l'utilisateur
async function verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password)
}

// Configuration du middleware limiteur de connexion
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite chaque IP à 5 requêtes par fenêtre de 15 minutes
    message: { error: "Too many failed login attempts, please try again later" }
});

// Création et authentification d'un utilisateur
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


// Création d'une tâche
app.post("/task", async (req, res) => {
    const { title, description, email, password } = req.body
    if (!title || !email || !password) {
        return res.status(400).json({ error: "Title, email, and password are required" })
    }
    try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const isPasswordValid = await verifyPassword(user, password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" })
        }
        const task = await Task.create({ title, description, userId: user.id })
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

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