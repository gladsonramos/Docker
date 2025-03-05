import express from 'express';
import { broadcast } from '../websocket/websocket.js';
import { saveMessage } from '../services/messageService.js';  

const router = express.Router();

router.post('/', async (req, res) => {
    const { message, senderName } = req.body; 
    console.log(req.body);

    // Validação de entrada
    if (!message || !senderName) {
        return res.status(400).json({ error: 'Mensagem e nome do remetente são obrigatórios' });
    }

    try {
        // Salva a mensagem no banco de dados
        const newMessage = await saveMessage(message, senderName);

        // Envia a nova mensagem para todos os clientes conectados via WebSocket
        broadcast({ message: message, senderName: senderName });

        // Responde com sucesso e os dados da nova mensagem
        res.json({
            success: true,
            message: 'Mensagem enviada de cliente externo.',
            data: newMessage,  // Retorna os dados da mensagem salva
        });
        
    } catch (err) {
        console.error('❌ Erro ao salvar mensagem:', err);
        res.status(500).json({ error: 'Erro ao salvar a mensagem' });
    }
});

export default router;
