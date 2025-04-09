const fs = require("fs");
const path = require("path");
const { getClient } = require("./WppClient");
const WebSocketService = require("./WebSocketService");
const { getMessagesWithStatus0, updateMessageStatus } = require('../repository/messageRepository');
const { getBotByPhoneWithOutCompany } = require("../repository/Bot");

async function saveFile(message) {
    try {
        const fileExtension = message.fileMimetype.split('/')[1] || 'bin';
        const fileTypeDir = path.join(process.cwd(), 'public', message.messageType);
        
        if (!fs.existsSync(fileTypeDir)) {
            fs.mkdirSync(fileTypeDir, { recursive: true });
        }
        
        const filePath = path.join(fileTypeDir, `${Date.now()}.${fileExtension}`);
        const fileBuffer = Buffer.from(message.fileContent, 'base64');
        fs.writeFileSync(filePath, fileBuffer);

        console.log(`✅ Arquivo salvo em: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`🚨 O arquivo não foi salvo corretamente: ${filePath}`);
        }
        return filePath;
    } catch (error) {
        console.error("🚨 Erro ao salvar o arquivo:", error);
        throw error;
    }
}

const checkAndProcessMessages = async () => {
    try {
        
        const messages = await getMessagesWithStatus0();

        if (messages.length === 0) return;

        for (const message of messages) {
            try {
                const phoneBot = message.senderNumber.replace("@c.us", "");
                const botData = await getBotByPhoneWithOutCompany(phoneBot);
                
                if (!botData || botData.length === 0) {
                    console.error(`❌ Nenhum bot encontrado para o número ${phoneBot}`);
                    continue;
                }

                const sessionName = botData[0].session_name;
        
                const client = getClient(sessionName);

                if (!client) {
                    console.warn("⚠️ Cliente ainda não inicializado. Ignorando envio de mensagens.");
                    continue;
                }

                let response;

                if (["audio", "video", "document", "image"].includes(message.messageType)) {
                    if (!message.fileContent || !message.fileMimetype) {
                        console.error("❌ Arquivo sem conteúdo ou MIME type inválido.");
                        continue;
                    }

                    const filePath = await saveFile(message);
                    console.log(`📤 Enviando ${message.messageType} para: ${message.receiverNumber}...`);
                    response = await client.sendFile(
                        message.receiverNumber,
                        filePath,
                        path.basename(filePath),
                        message.caption || "📎 Aqui está seu arquivo!"
                    );
                } else if (message.messageType === "list-message") {
                    response = await client.sendListMessage('5521986347413', {
                        buttonText: "Select a option",
                        description: "Desc for list",
                        sections: [
                            {
                                title: "Section 1",
                                rows: [
                                    {
                                        rowId: "my_custom_id",
                                        title: "Test 1",
                                        description: "Description 1"
                                    },
                                    {
                                        rowId: "2",
                                        title: "Test 2",
                                        description: "Description 2"
                                    }
                                ]
                            }
                        ]
                    });
                } else {
                    response = await client.sendText(message.receiverNumber, message.message);
                }

                console.log("✅ Mensagem enviada:", response);
                await updateMessageStatus(message.id, 1);
                WebSocketService.broadcast(`Mensagem enviada para ${message.receiverNumber}`);
            } catch (error) {
                console.error("🚨 Erro ao enviar mensagem:", error);
                await updateMessageStatus(message.id, 5);
            }
        }
    } catch (error) {
        console.error("❌ Erro ao processar mensagens:", error);
    }
};
module.exports = { checkAndProcessMessages };