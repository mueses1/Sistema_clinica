import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

const appointmentModel = sequelize.define("appointment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER, // Changed to INTEGER to match MySQL ID
        allowNull: false,
    },
    docId: {
        type: DataTypes.INTEGER, // Changed to INTEGER to match MySQL ID
        allowNull: false,
    },
    slotDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slotTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userData: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    docData: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    cancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    payment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default appointmentModel;