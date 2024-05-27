import { Sequelize } from "sequelize";
import { db } from "../database/db.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

export const Cars = db.define('cars', {
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
    price: {
        type: DataTypes.INTEGER,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
        }
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deletedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_deleted: {
        // 0: item not deleted, 1: item deleted
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userUuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false, //tidak boleh null
        validate: {
            notEmpty: true, // tidak boleh bernilai empty string
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Cars, { foreignKey: 'userUuid' });
Cars.belongsTo(Users, { foreignKey: 'userUuid' });

export default Cars;