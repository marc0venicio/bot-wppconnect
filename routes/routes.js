const express = require('express');
const { generateToken } = require('../controllers/BotController');
const { initializeClient } = require('../services/WppClient');

const routes = express.Router();


routes.post('/gerar-token', generateToken);
routes.post('/start-bot', async (req, res) => {
    try {
        const { session_name, client_id } = req.body;
    
        await initializeClient(session_name);

        //aqui vamos buscar o QRCode no banco
        const qrCode = await getQrCode(session_name, client_id);
    
        // precisaremos criar um campo no banco pra verificar se o bot já está conectado
        // if (alreadyConnected && !qrCode) {
        //   return res.status(200).json({
        //     message: `🤖 Sessão '${session_name}' já está conectada.`,
        //     data: null
        //   });
        // }
    
        res.status(200).json({
          message: '🤖 Bot iniciado. Escaneie o QRCode para autenticar.',
          data: { qrCode }
        });
        
      } catch (error) {
        console.error('Erro ao iniciar bot:', error);
        res.status(500).json({ message: '❌ Erro ao iniciar bot', error });
      }
});

module.exports = routes;