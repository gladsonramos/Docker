import express from 'express';
import User from '../models/User.js';
import { sendToQueue } from '../config/rabbitmq.js'; // Importando função de envio
import { broadcast } from '../websocket/websocket.js';

const router = express.Router();

// Criar usuário diretamente no banco e enviar para RabbitMQ
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.create({ name, email });

        broadcast({ name });

        // Enviar mensagem para a fila do RabbitMQ
        const message = { action: 'create_user', user };
        await sendToQueue('user_tasks', message);

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Criar usuário SOMENTE pela fila (processamento assíncrono)
router.post('/rota', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Criar objeto da mensagem
        const message = { action: 'create_user_rota', user: { name, email } };

        // Enviar para a fila
        await sendToQueue('user_tasks', message);

        res.status(202).json({ message: "Usuário enviado para processamento na fila" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar usuários
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
