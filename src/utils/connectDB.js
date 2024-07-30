import { Sequelize } from "sequelize";
import ENV from "../config/server-config.js";

export const sequelize = new Sequelize('Mysql', ENV.DB_USER, ENV.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});