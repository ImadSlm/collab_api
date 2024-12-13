require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const sequelize = require("./config/database")
const User = require("./models/user")
const Task = require("./models/task")
const bcrypt = require("bcrypt")

const app = express()
app.use(bodyParser.json())
const port = 3000

app.post("/auth", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.create({ email, password })
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll()
        res.status(200).json(tasks)
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
})

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
