import { Sequelize } from "sequelize";
import { db } from "../database/db.js";

const { DataTypes } = Sequelize;

export const Users = db.define('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
        }
    },
    refresh_token: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true
});

export default Users;