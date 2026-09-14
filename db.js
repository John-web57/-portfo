const path = require('path');

let sequelize = null;
let isSqliteAvailable = false;

try {
    const { Sequelize } = require('sequelize');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, 'database.sqlite'),
        logging: false,
    });
} catch (error) {
    console.warn('SQLite native initialization notice (using resilient fallback mode):', error.message);
}

const connectDB = async () => {
    if (!sequelize) {
        console.log('Database running in resilient local JSON storage mode.');
        isSqliteAvailable = false;
        return;
    }

    try {
        await sequelize.authenticate();
        console.log('SQLite database connected successfully');

        // Sync all models
        await sequelize.sync();
        console.log('Database models synchronized');
        isSqliteAvailable = true;
    } catch (error) {
        console.warn('SQLite connection notice (using resilient fallback mode):', error.message);
        isSqliteAvailable = false;
    }
};

module.exports = { sequelize, connectDB, isSqliteAvailable: () => isSqliteAvailable };