// backend/models/User.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
    },
    {
        timestamps: false, // Remove os campos createdAt e updatedAt, se não forem necessários
        tableName: 'users', // Garante que o nome da tabela não seja pluralizado
    }
);

export default User;
