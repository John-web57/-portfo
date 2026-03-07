const { Sequelize } = require('sequelize');
const path = require('path');

// Create SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite database connected successfully');

        // Sync all models
        await sequelize.sync();
        console.log('Database models synchronized');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };