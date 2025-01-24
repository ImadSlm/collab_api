const { Sequelize } = require("sequelize")
require("dotenv").config()
const database = process.env.DB_DATABASE
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST

// Création d'une instance de Sequelize pour se connecter à la base de données
const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: 3306,
    dialect: "mariadb",
})

module.exports = sequelize
