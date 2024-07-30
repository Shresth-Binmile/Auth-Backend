import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/connectDB.js';

const verification_tables = sequelize.define(
  'verification_tables',
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    vCode: {
        type: DataTypes.NUMBER,
        allowNull: true
    }
  }
);

export default verification_tables