const wppconnect = require('@wppconnect-team/wppconnect');

const sendMessage = async (phone, message, mediaPath = null, filename = null) => {
    try {
        const client = await wppconnect.create({
            session: 'marcos-bot',
            statusFind: (status) => console.log("Status:", status)
        });

        console.log("WhatsApp conectado!");
        
        if (mediaPath) {
            await client.sendFile(`${phone}@c.us`, mediaPath, { filename, caption: message || '' });
            console.log("Mídia enviada para:", phone);
        } else {
            await client.sendText(`${phone}@c.us`, message);
            console.log("Mensagem enviada para:", phone);
        }
    } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
    }
};

module.exports = sendMessage;