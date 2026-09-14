const { DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { sequelize, isSqliteAvailable } = require('../db');

const fallbackFile = path.join(__dirname, '..', 'contacts.json');

function readFallbackContacts() {
    try {
        if (fs.existsSync(fallbackFile)) {
            const data = fs.readFileSync(fallbackFile, 'utf8');
            return JSON.parse(data) || [];
        }
    } catch (e) {
        console.error('Error reading fallback contacts:', e.message);
    }
    return [];
}

function writeFallbackContacts(contacts) {
    try {
        fs.writeFileSync(fallbackFile, JSON.stringify(contacts, null, 2), 'utf8');
    } catch (e) {
        console.error('Error writing fallback contacts:', e.message);
    }
}

// Sequelize Model definition
let SqlModel = null;
if (sequelize) {
    try {
        SqlModel = sequelize.define('Contact', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true, notEmpty: true }
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        status: {
            type: DataTypes.ENUM('new', 'read', 'replied'),
            defaultValue: 'new'
        }
    }, {
        timestamps: true
    });
    } catch (e) {
        console.warn('Sequelize define warning:', e.message);
    }
}

// Transparent Proxy / Wrapper that seamlessly works with or without SQLite native bindings
const Contact = {
    async create(data) {
        if (isSqliteAvailable() && SqlModel) {
            return await SqlModel.create(data);
        }
        const contacts = readFallbackContacts();
        const newContact = {
            id: contacts.length ? Math.max(...contacts.map(c => c.id || 0)) + 1 : 1,
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            status: data.status || 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        contacts.push(newContact);
        writeFallbackContacts(contacts);
        return newContact;
    },

    async findAll(options = {}) {
        if (isSqliteAvailable() && SqlModel) {
            return await SqlModel.findAll(options);
        }
        const contacts = readFallbackContacts();
        return contacts.slice().reverse();
    },

    async findByPk(id) {
        if (isSqliteAvailable() && SqlModel) {
            return await SqlModel.findByPk(id);
        }
        const contacts = readFallbackContacts();
        return contacts.find(c => String(c.id) === String(id)) || null;
    },

    async update(values, { where }) {
        if (isSqliteAvailable() && SqlModel) {
            return await SqlModel.update(values, { where });
        }
        const contacts = readFallbackContacts();
        let updatedCount = 0;
        const updated = contacts.map(c => {
            if (String(c.id) === String(where.id)) {
                updatedCount++;
                return { ...c, ...values, updatedAt: new Date().toISOString() };
            }
            return c;
        });
        if (updatedCount > 0) {
            writeFallbackContacts(updated);
        }
        return [updatedCount];
    }
};

module.exports = Contact;