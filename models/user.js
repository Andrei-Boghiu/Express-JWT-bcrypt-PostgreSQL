const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = User;
