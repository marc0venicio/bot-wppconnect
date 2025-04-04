const {pool, secondaryDB} = require("../services/db");

const getBotByName = async (name, idComp) => {
    try {
        const sql = `SELECT *
        FROM bots b
        WHERE b.id_empresa = ? AND b.nome = ?`;
        const [rows, _] = await pool.query(sql, [idComp, name]);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getBotById = async (botId) => {
    try {
        const sql = `SELECT b.id, b.id_empresa, b.nome, b.celular, b.intervalo, b.token, e.nome AS empresa
        FROM bots b
        inner join empresas e on b.id_empresa = e.id
        WHERE b.id = ?
        `;
        const [rows, _] = await pool.query(sql, botId);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getBotsByIdComp = async (idComps) => {
    try {
        const sql = `SELECT e.nome AS empresa, b.id, b.nome, b.celular, b.intervalo
        FROM bots b
        JOIN empresas e ON b.id_empresa = e.id
        WHERE b.id_empresa IN (${idComps})`;
        const [rows, _] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getBotByPhone = async (phone, idComp) => {
    try {
        const sql = `SELECT *
        FROM bots b
        WHERE b.id_empresa = ? AND b.celular = ?`;
        const [rows, _] = await pool.query(sql, [idComp, phone]);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getBotByPhoneRaw = async (phone, idComp) => {
    try {
        const sql = `SELECT *
        FROM bots b
        WHERE b.number = ?`;
        const [rows, _] = await secondaryDB.query(sql, [phone]);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getBotByPhoneWithOutCompany = async (phone) => {
    try {
        const sql = `SELECT *
        FROM bots b
        WHERE b.celular = ?`;
        const [rows, _] = await pool.query(sql, [phone]);
        return rows;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getBots = async (params) => {
    try {
        const { start, length, search } = params;
        const searchQuery = search.value ? `AND bots.nome LIKE ?` : '';
        const searchParams = search.value ? [`%${search.value}%`] : [];
        const sql = `
        SELECT 
            bots.id,
            bots.nome AS bot_nome,
            empresas.nome AS empresa_nome,
            bots.celular,
            bots.intervalo,
            bots.status,
            bots.qrcode_status,
            servicos.nome AS servico_nome
        FROM 
            bots
        JOIN 
            empresas ON bots.id_empresa = empresas.id
        JOIN 
            servicos ON bots.id_servico = servicos.id
        ${searchQuery}
        LIMIT ?, ?
        `;
        const [result] = await pool.query(sql, [...searchParams, parseInt(start), parseInt(length)]);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getTotalBotCount = async (search) => {
    try {
        const searchQuery = search ? `WHERE bots.nome LIKE ?` : '';
        const searchParams = search ? [`%${search}%`] : [];

        const sql = `SELECT COUNT(*) AS total FROM bots ${searchQuery}`;
        const [result] = await pool.query(sql, searchParams);
        return result[0].total;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

const insertBot = async ({ idComp, name, token, phone, status, idServ = 1 }) => {
    try {
        const sql = `INSERT INTO bots (id_empresa, nome, token, celular, id_servico, status) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [idComp, name, token, phone, idServ, status]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const delBot = async (botId) => {
    try {
        const sql = `DELETE FROM bots WHERE id = ?`;
        const [result] = await pool.query(sql, botId);
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateBot = async (id, updatedFields) => {
    try {
        const columns = Object.keys(updatedFields)
            .map(field => `\`${field}\` = ?`)
            .join(', ');

        const sql = `UPDATE bots SET ${columns} WHERE id = ?`;

        const values = [...Object.values(updatedFields), id];

        const [result] = await pool.query(sql, values);

        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
};


module.exports = {
    getBotByName,
    getBotsByIdComp,
    getBotByPhone,
    getBotByPhoneWithOutCompany,
    insertBot,
    delBot,
    getBots,
    getTotalBotCount,
    getBotById,
    updateBot,
    getBotByPhoneRaw
}