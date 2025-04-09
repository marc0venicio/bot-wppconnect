const wppconnect = require('@wppconnect-team/wppconnect');
const { getQrCode, saveQrCode, getAllActive, updateBotStatus } = require('../repository/Bot');
const fs = require('fs');
const path = require('path');

const removeLockFile = (sessionName) => {
  const lockFile = path.join(__dirname, '../tokens', sessionName, 'SingletonLock');
  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
    console.log(`🧹 Lock file removido para sessão ${sessionName}`);
  }
};

const clients = new Map();

const createSessionInitial = async (sessionName, idEmpresa) => {
  if (sessionName) {
    if (clients.has(sessionName)) {
      console.log(`⚠️ Sessão ${sessionName} já está ativa.`);
      const qrCodeFromDb = await getQrCode(sessionName, idEmpresa);
      return { qrCode: qrCodeFromDb, alreadyConnected: true };
    }

    let resolveQrCode;
    const qrCodePromise = new Promise((resolve) => {
      resolveQrCode = resolve;
    });
    removeLockFile(sessionName);
    const client = await wppconnect.create({
      session: sessionName,
      catchQR: async (base64Qrimg) => {
        await saveQrCode(sessionName, idEmpresa, base64Qrimg);
        resolveQrCode(base64Qrimg);
      },
      statusFind: async (status, session) => {
        console.log(`📶 Sessão ${session} - Status: ${status}`);
        if(status == 'qrReadSuccess'){
          await updateBotStatus(session, 2);
        }
      },
      headless: true,
      useChrome: true,
      browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
      tokenStore: 'file',
      folderNameToken: './tokens',
      browserSessionToken: sessionName,
    });

    client.onMessage(async (message) => {
      const handleSurveyBot = require("../controllers/handleSurveyBot");
      await handleSurveyBot(message);
    });

    clients.set(sessionName, { client });

    const qrCode = await qrCodePromise;
    return { qrCode, alreadyConnected: false };
  }

};

const startAllActiveSessionsInitial = async () => {
  const bots = await getAllActive();
  for (const bot of bots) {
    const { session_name, id_empresa } = bot;
    await createSessionInitial(session_name, id_empresa);
    console.log(`✅ Sessão iniciada automaticamente: ${session_name}`);
  }
};

const stopSession = async (sessionName) => {
  const session = clients.get(sessionName);
  if (session?.client) {
    await session.client.close();
    clients.delete(sessionName);
    console.log(`🛑 Sessão encerrada: ${sessionName}`);
  }
};

const getClient = (sessionName) => {
  return clients.get(sessionName)?.client || null;
};

const listActiveSessions = () => {
  return [...clients.keys()];
};

module.exports = {
  createSessionInitial,
  startAllActiveSessionsInitial,
  stopSession,
  getClient,
  listActiveSessions,
};
