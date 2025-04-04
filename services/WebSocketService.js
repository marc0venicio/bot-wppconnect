const WebSocket = require('ws');

// Criação do servidor WebSocket
const wss = new WebSocket.Server({ port: 8989 });

// Função para notificar todos os clientes WebSocket conectados
const broadcast = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');
    ws.send('Conexão estabelecida. Aguardando mensagens...');
});

module.exports = { broadcast };
