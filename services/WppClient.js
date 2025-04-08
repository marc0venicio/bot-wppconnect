const wppconnect = require('@wppconnect-team/wppconnect');
const { getQrCode, saveQrCode } = require('../repository/Bot');

const clients = new Map(); // chave: sessionName | valor: { client, qrCode }

const initializeClient = async (sessionName = 'default', idEmpresa = 1) => {
    const existing = clients.get(sessionName);
    if (existing && existing.client) {
      console.log(`⚠️ Sessão ${sessionName} já ativa.`);
      const qrCodeFromDb = await getQrCode(sessionName, idEmpresa);
      return { qrCode: qrCodeFromDb, alreadyConnected: true };
    }
  
    let resolveQrCode;
    const qrCodePromise = new Promise((resolve) => {
      resolveQrCode = resolve;
    });
  
    const client = await wppconnect.create({
      session: sessionName,
      catchQR: async (base64Qrimg) => {
        await saveQrCode(sessionName, idEmpresa, base64Qrimg);
        resolveQrCode(base64Qrimg);
      },
      statusFind: (statusSession, session) => {
        console.log(`📶 Sessão ${session} - status: ${statusSession}`);
      },
      headless: true,
      useChrome: true,
      browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
      tokenStore: 'file',
      folderNameToken: './tokens',
    });
  
    client.onMessage(async (message) => {
      const handleSurveyBot = require("../controllers/handleSurveyBot");
      await handleSurveyBot(message);
    });
  
    clients.set(sessionName, { client });
  
    // const qrCode = await qrCodePromise;
    // return { qrCode, alreadyConnected: false };
  };

const stopClient = async (sessionName = 'default') => {
  const session = clients.get(sessionName);
  if (session && session.client) {
    await session.client.close();
    clients.delete(sessionName);
    console.log(`🛑 Sessão ${sessionName} finalizada.`);
  } else {
    console.log(`⚠️ Sessão ${sessionName} não está ativa.`);
  }
};

const getClient = (sessionName = 'default') => {
    console.log(clients.get(sessionName)?.client || null);
  return clients.get(sessionName)?.client || null;
};

const isClientActive = (sessionName = 'default') => {
  return clients.has(sessionName);
};

module.exports = {
  initializeClient,
  stopClient,
  getClient,
  isClientActive,
};
