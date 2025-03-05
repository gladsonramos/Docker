import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('✅ Conectado ao RabbitMQ');
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
    }
};

const sendToQueue = async (queue, message) => {
    if (!channel) {
        console.error('Canal RabbitMQ não inicializado.');
        return;
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`📤 Mensagem enviada para a fila: ${queue}`);
};

export { connectRabbitMQ, sendToQueue };
