const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Research = sequelize.define('Research', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Ongoing', 'Completed', 'Published'),
        defaultValue: 'Pending'
    },
    progress: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    proofFileName: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    proofData: {
        type: DataTypes.TEXT,
        defaultValue: null
    },
    mentorApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    publishedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'research',
    timestamps: true,
    updatedAt: false
});

module.exports = Research;
