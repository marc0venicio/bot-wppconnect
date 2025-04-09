const express = require('express');
const { generateToken } = require('../controllers/BotController');
const { createSession, stopSession } = require('../services/WppClient');
const { getQrCode } = require('../repository/Bot');

const routes = express.Router();


routes.get('/health', async (req, res) => {
    res.json({ status: 'OK' });
}
);
routes.post('/gerar-token', generateToken);
routes.post('/start-bot', async (req, res) => {
    try {
        const { session_name, client_id } = req.body;
    
        createSession(session_name, client_id);

        const result = await getQrCode(session_name, client_id);

        res.json({
          success: true,
          data: result
        }).status(200);
        
      } catch (error) {
        console.error('Erro ao iniciar bot:', error);
        res.status(500).json({ message: '❌ Erro ao iniciar bot', error });
      }
});

// Rota para listar sessões ativas
routes.get('/sessions', (req, res) => {
  const sessions = SessionManager.listActiveSessions();
  res.json({ activeSessions: sessions });
});

// Rota para parar uma sessão
routes.post('/sessions/stop', async (req, res) => {
  const { session_name } = req.body;

  try {
    await stopSession(session_name);
    res.json({ success: true, message: 'Sessão parada com sucesso.' });
  } catch (error) {
    console.error('Erro ao parar sessão:', error);
    res.status(500).json({ success: false, error: 'Erro ao parar sessão.' });
  }
});

module.exports = routes;