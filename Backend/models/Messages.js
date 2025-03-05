import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Message = sequelize.define(
    'messages', // Nome da tabela
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false, // Não pode ser nulo
        },
        sender_name: {
            type: DataTypes.STRING,
            allowNull: false, // Não pode ser nulo
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Define a data de criação como a data e hora atual
            allowNull: false, // Não pode ser nulo
        },
    },
    {
        tableName: 'messages', // Nome da tabela
        timestamps: true, // Permite que o Sequelize use os campos de timestamps
        createdAt: 'created_at', // Configura o campo 'created_at' explicitamente
        updatedAt: false, // Se não houver campo 'updated_at', desabilite o Sequelize tentar gerá-lo
    }
);

export default Message;
