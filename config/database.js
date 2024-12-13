const { Sequelize } = require("sequelize")
require("dotenv").config()
const database = process.env.DB_DATABASE
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    port: 3306,
    dialect: "mariadb",
})

module.exports = sequelize
