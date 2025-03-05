import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // Importando módulo HTTP
import userRoutes from './routes/UserRoutes.js';
import websocket from './routes/WebsocketRoutes.js';
import connectDB from './config/db.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { setupWebSocket } from './websocket/websocket.js';
//import { consumeMessages } from './workers/consumer.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados e RabbitMQ
connectDB();
connectRabbitMQ();

// Iniciar consumidor RabbitMq
//consumeMessages();

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/websocket', websocket);

// Criando servidor HTTP para ser usado pelo WebSocket
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Configurando WebSocket
setupWebSocket(server); // Inicia WebSocket aqui

// Inicia o servidor HTTP
server.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
