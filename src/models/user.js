import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/connectDB.js';

const Users = sequelize.define(
  'Users',
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
  }
);

// console.log(User === sequelize.models.User);

export default Users