const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./user")

const Task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id",
        },
    },
})

module.exports = Task
