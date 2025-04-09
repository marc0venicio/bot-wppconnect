const { secondaryDB } = require("../services/db");

const getMessagesWithStatus0 = async () => {
    try {
        const sql = `SELECT * FROM messages WHERE status = 0 limit 2`;
        const [rows, _] = await secondaryDB.query(sql);
        return rows;
    } catch (error) {
        console.error('Erro ao buscar mensagens com status 0:', error);
        return false;
    }
};

const updateMessageStatus = async (messageId, status) => {
    try {
        const sql = `UPDATE messages SET status = ?, updated_at=NOW() WHERE id = ?`;
        const [result] = await secondaryDB.query(sql, [status, messageId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Erro ao atualizar status da mensagem ${messageId}:`, error);
        return false;
    }
};

module.exports = { getMessagesWithStatus0, updateMessageStatus };