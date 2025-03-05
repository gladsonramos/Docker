import WebSocket, { WebSocketServer } from 'ws';
import { saveMessage, getMessages } from '../services/messageService.js'; // Importe as funções de salvar e obter mensagens

const clients = []; // Lista de clientes conectados

export async function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', async (ws) => {
        try {
            // Envia as últimas 50 mensagens para o cliente ao se conectar
            const messages = await getMessages();
            ws.send(JSON.stringify({ type: 'history', messages }));

        } catch (error) {
            console.error('Erro ao obter mensagens anteriores:', error);
        }

        clients.push(ws);

        // Evento para receber mensagens do cliente
        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data);
                console.log('📩 Mensagem recebida:', message);

                // Verifica se a mensagem tem os campos necessários
                if (!message.message || !message.senderName) {
                    return ws.send(JSON.stringify({ error: 'Mensagem e nome do remetente são obrigatórios.' }));
                }

                // Salva a mensagem no banco de dados
                await saveMessage(message.message, message.senderName);

                // Envia a mensagem para todos os clientes conectados, exceto o remetente
                broadcast({ message: message.message, senderName: message.senderName });

            } catch (error) {
                console.error('❌ Erro ao processar mensagem:', error);
                ws.send(JSON.stringify({ error: 'Erro ao processar sua mensagem.' }));
            }
        });

        // Remove o cliente da lista quando desconectar
        ws.on('close', () => {
            clients.splice(clients.indexOf(ws), 1);
            console.log('🔴 Websocket - Conexão fechada');
        });

        ws.on('error', (error) => {
            console.error('⚠️ Erro na conexão WebSocket:', error);
        });
    });

    console.log('✅ WebSocket Server inicializado!');
}

// Função para enviar mensagem para TODOS os clientes conectados
export function broadcast(data, sender = null) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== sender) {
            client.send(JSON.stringify(data));
        }
    });
}
