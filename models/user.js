const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Création du modèle User
const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4,
        // allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
        },
    },
});

module.exports = User;