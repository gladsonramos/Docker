import Message from '../models/Messages.js';

export const saveMessage = async (message, senderName) => {
    return await Message.create({
        message: message,
        sender_name: senderName || 'Anônimo', // Atribui 'Anônimo' caso o nome não seja fornecido
    })
    .then(newMessage => {
        return newMessage; // Retorna a mensagem recém-criada
    })
    .catch(err => {
        console.error('Erro ao salvar a mensagem:', err);
        throw err;
    });
};


export const getMessages = () => {
    return Message.findAll({
        order: [['created_at', 'DESC']], // Ordena pela data de criação, da mais recente para a mais antiga
        limit: 50, // Limita a 50 mensagens
    })
    .then(messages => {
        return messages; // Retorna as mensagens recuperadas
    })
    .catch(err => {
        console.error('Erro ao recuperar as mensagens:', err);
        throw err;
    });
};
