const { create } = require('@wppconnect-team/wppconnect');

let clientInstance = null;

const initializeClient = async () => {
    if (!clientInstance) {
        clientInstance = await create({
            puppeteerOptions: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        console.log("Cliente WPPConnect inicializado!");

        clientInstance.onMessage(async (message) => {
            console.log("Nova mensagem recebida:", message);
            const handleSurveyBot = require("../controllers/handleSurveyBot");
            await handleSurveyBot(message);
        });
    }
    return clientInstance;
};

module.exports = { initializeClient };
