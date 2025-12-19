import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || "appointy",
    process.env.MYSQL_USER || "root",
    process.env.MYSQL_PASSWORD || "",
    {
        host: process.env.MYSQL_HOST || "localhost",
        dialect: "mysql",
        logging: false, // Set to true to see SQL queries in console
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL Database Connected");
        // Sync models - changed from alter to false to avoid index conflicts
        await sequelize.sync({ force: false });
        console.log("Database models synchronized");
    } catch (error) {
        console.error("MySQL connection error:", error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default connectDB;
