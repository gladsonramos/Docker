import amqp from 'amqplib';
import User from '../models/User.js';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'user_tasks';

export const consumeMessages = async () => {

    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`🔄 Aguardando mensagens na fila: ${QUEUE_NAME}`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg) {
                try {
                    const message = JSON.parse(msg.content.toString());
                    const { user } = message

                    console.log(`📩 Mensagem recebida:`, message);

                    if (message.action === 'create_user_rota') {
                        await User.create({ name: user.name, email: user.email });
                        console.log(`✅ Usuário ${user.name} criado com sucessos!`);
                    }

                    channel.ack(msg); // Confirma o processamento da mensagem
                } catch (error) {
                    console.error('❌ Erro ao processar mensagem:', error);
                    channel.nack(msg, false, false); // Reenvia para a fila; 
                }
            }
        });
    } catch (error) {
        console.error('❌ Erro no consumidor RabbitMQ:', error);
    }
};

// Iniciar consumidor
consumeMessages();
