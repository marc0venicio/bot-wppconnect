const { getBotById } = require("../repository/Bot");
const { encryptSession } = require('@wppconnect-team/wppconnect');

const getQrCodeBot = async (req, res) => {
    // const { botId } = req.params;

    // if (!botId) {
    //     res.json({ success: false, message: 'Dados Inválidos', type: "warning" });
    //     return;
    // }

    // const bot = await getBotById(botId);

    // if (!bot) {
    //     res.json({ success: false, message: 'Erro ao buscar QrCode.', type: "danger" });
    //     return;
    // }

    // if (!bot.length) {
    //     res.json({ success: false, message: 'Robô não encontrado', type: "danger" });
    //     return;
    // }

    // const session = bot[0].nome;
    // const token = bot[0].token;

    // // const sessionClosed = await wpp.closeSession(session, token);
    // // if (!sessionClosed || sessionClosed.status !== true) {
    // //     res.json({ success: false, message: 'Erro ao gerar QRCode', type: "danger" });
    // //     return;
    // // }

    // await wpp.startSession(session, token);

    // let sessionStatus;
    // const permitedStatus = ['CONNECTED', 'QRCODE'];

    // while (!permitedStatus.includes(sessionStatus)) {
    //     const res = await wpp.getStatus(session, token);
    //     if (!res) break;
    //     sessionStatus = res.status;
    //     await setTimeout(5000);
    // }

    // const base64 = await wpp.getQRCode(session, token);
    // if (!base64) {
    //     res.json({ success: false, message: 'Erro ao gerar QRCode', type: "danger" });
    //     return;
    // }

    // const statusQrUpdated = await updateBot(botId, { qrcode_status: sessionStatus });
    // if (!statusQrUpdated) {
    //     res.json({ success: false, message: 'Error ao atualizar estado do Robô', type: "danger" });
    //     return;
    // }

    // const data = typeof base64 === 'object' ? "QRCode já conectado" : `data:image/png;base64,${base64}`;

    // res.json({
    //     success: true,
    //     message: 'QR Code gerado com sucesso!',
    //     type: 'success',
    //     data: data
    // });

    // return;
}

const generateToken = async (req, res) => {
    try {
      const { session_name, secret_key } = req.body;
  
      if (!session_name || !secret_key) {
        return res.status(400).json({ message: 'Parâmetros obrigatórios ausentes.' });
      }
  
      const token = await encryptSession(session_name, secret_key);
  
      if (!token) {
        return res.status(500).json({ message: 'Falha ao gerar token.' });
      }
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      return res.status(500).json({ message: 'Erro interno ao gerar token.' });
    }
  };

module.exports = {
    getQrCodeBot,
    generateToken
};