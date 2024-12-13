const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
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