const { secondaryDB } = require("../services/db")
const getMessages = async () => {
    try {
        const sql = `SELECT * FROM messages`;
        const [rows, _] = await secondaryDB.query(sql);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const insertMessage = async ({ json, chatId, msgBody, phoneFrom, phoneTo, msgId, status, fileContent }) => {
    try {
        const sql = `INSERT INTO messages (
            chat_id, response_to, message, status, created_at, senderNumber, senderName, receiverName,
            receiverNumber, whatsappID, whatsappTime, whatsappAckStatus, updatedWhatsappAck_at,
            WhatsappMessageIsForwarded, messageType, isRevoked, isEdited, 
            fileName, fileExtension, fileMimetype, fileContent, fileSize, fileDuration, 
            user_id, tenantId, tenantDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const isMediaMessage = ['image', 'video', 'audio', 'document', 'sticker'].includes(json.type);
        const processedMsgBody = isMediaMessage ? '' : msgBody;

        const match = json.id ? json.id.split('_').pop() : null;
        const whatsappID = match || "";

        const values = [
            chatId,
            json.parentMsgId || null,
            processedMsgBody ?? '',
            status,
            new Date(json.timestamp * 1000), 
            phoneFrom || "",
            json.sender?.pushname || "Desconhecido",
            "Bot-3",
            phoneTo || "",
            whatsappID || "",
            new Date(json.timestamp * 1000),
            json.ack || 0,
            new Date(json.timestamp * 1000),
            json.isForwarded ? 1 : 0,
            json.type,
            0, 
            0,
            json.fileName || null, 
            json.extension || null, 
            json.mimetype || null, 
            fileContent,           
            json.size || null, 
            json.callDuration || null,
            null,
            null,
            new Date()
        ];

        const [result] = await secondaryDB.query(sql, values);
        return result.insertId;
    } catch (error) {
        console.error(" Erro ao inserir mensagem:", error);
        return false;
    }
};

module.exports = {
    getMessages,
    insertMessage
}
