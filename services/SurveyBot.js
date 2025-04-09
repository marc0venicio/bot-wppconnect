const { handleChatMessage, handleButtonResponseMessage, handleLocationMessage } = require("../helpers/MessageHandler");
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { getClient } = require("../services/WppClient");
const { insertMessage } = require("../repository/Message");
const { getBotByPhoneWithOutCompany } = require("../repository/Bot");

class SurveyBot {

  constructor() {
  }

  async storeMessage({ json, msgBody, msgType, phoneFrom, phoneTo, msgId }) {
    try {
      let jsonData = {
        json,
        msgBody,
        msgType,
        phoneFrom,
        phoneTo,
        status: 2,
        msgId
      };

      switch (json.type) {
        case 'notification_template':
        case 'e2e_notification':
          console.log("🔕 Ignoring notification message.");
          return;

        case 'sticker':
        case 'image':
        case 'video':
        case 'document':
        case 'ptt':
        case 'ptv':
        case 'audio':
          jsonData = await this.handleMediaMessage(json, jsonData);
          break;

        case 'location':
          jsonData = await handleLocationMessage(phoneFrom, json, jsonData);
          break;

        case 'buttons_response':
          jsonData = await handleButtonResponseMessage(phoneFrom, json, jsonData);
          break;

        case 'vcard':
        case 'chat':
          if ('dynamicReplyButtons' in json) {
            jsonData['messageType'] = 'buttons';
            jsonData = await handleButtonResponseMessage(phoneFrom, json, jsonData);
          } else {
            jsonData = await handleChatMessage(phoneFrom, jsonData);
          }
          break;

        default:
          console.log(" Unknown message type, treating as chat.");
          jsonData = await handleChatMessage(phoneFrom, jsonData);
          break;
      }

      await insertMessage(jsonData);

    } catch (error) {
      console.error("🚨 Error processing message:", error);
    }
  }

  async handleMediaMessage(mediaMessage, jsonData) {
    try {
      
      const phoneBot = jsonData.from.replace("@c.us", "");
      const botData = await getBotByPhoneWithOutCompany(phoneBot);

      if (!botData || botData.length === 0) {
          console.error(`❌ Nenhum bot encontrado para o número ${phoneBot}`);
          return;
      }

      const sessionName = botData[0].session_name;
      const client = getClient(sessionName);

      if (!client) {
          console.warn("⚠️ Cliente ainda não inicializado. Ignorando processamento de mídia.");
          return;
      }

      if (mediaMessage.type === 'audio' || mediaMessage.type === 'ptt') {
        console.log('Processando mensagem de áudio...');

        const audioDir = path.join(__dirname, 'media', 'audios');
        if (!fs.existsSync(audioDir)) {
          fs.mkdirSync(audioDir, { recursive: true });
        }

        const timestamp = new Date().getTime();
        const fileExtension = 'ogg';
        const fileName = `audio_${timestamp}.${fileExtension}`;
        const filePath = path.join(audioDir, fileName);

        const buffer = await client.downloadMedia(mediaMessage);

        let content = buffer.toString("utf-8");
        console.log(content)

        jsonData.fileContent= content.replace(/^data:audio\/ogg; codecs=opus;base64,/, "");

        fs.writeFileSync(filePath, buffer);
        console.log(`Áudio salvo em: ${filePath}`);

        jsonData.mediaUrl = filePath;
        jsonData.mediaType = 'audio';
        jsonData.mediaSize = buffer.length;
        jsonData.mediaMimeType = mime.lookup(fileExtension) || 'audio/ogg';

        return jsonData;
      }

      if(mediaMessage.type === 'image') {
        console.log('Processando mensagem de áudio...');

        const imageDir = path.join(__dirname, 'media', 'images');
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const timestamp = new Date().getTime();
        const fileExtension = 'jpg';
        const fileName = `image_${timestamp}.${fileExtension}`;
        const filePath = path.join(imageDir, fileName);

        const buffer = await client.downloadMedia(mediaMessage);

        let content = buffer.toString("utf-8");

        jsonData.fileContent = content;
        console.log(content)

        fs.writeFileSync(filePath, buffer);
        console.log(`Imagem salva em: ${filePath}`);

        jsonData.mediaUrl = filePath;
        jsonData.mediaType = 'audio';
        jsonData.mediaSize = buffer.length;
        jsonData.mediaMimeType = mime.lookup(fileExtension) || 'image/jpeg';

      }

      if(mediaMessage.type === 'sticker') {
        console.log('Processando mensagem de áudio...');

        const stickerDir = path.join(__dirname, 'media', 'sticker');
        if (!fs.existsSync(stickerDir)) {
          fs.mkdirSync(stickerDir, { recursive: true });
        }

        const timestamp = new Date().getTime();
        const fileExtension = 'webp';
        const fileName = `sticker_${timestamp}.${fileExtension}`;
        const filePath = path.join(stickerDir, fileName);

        const buffer = await client.downloadMedia(mediaMessage);

        let content = buffer.toString("utf-8");

        jsonData.fileContent = content.replace(/^data:image\/webp;base64,/, "");

        fs.writeFileSync(filePath, buffer);
        console.log(`Imagem salva em: ${filePath}`);

        jsonData.mediaUrl = filePath;
        jsonData.mediaType = 'sticker';
        jsonData.mediaSize = buffer.length;
        jsonData.mediaMimeType = mime.lookup(fileExtension) || 'image/webp';
        
      }

      if(mediaMessage.type === 'document') {
        console.log('Processando mensagem de document...');

        const documentDir = path.join(__dirname, 'media', 'document');
        if (!fs.existsSync(documentDir)) {
          fs.mkdirSync(documentDir, { recursive: true });
        }

        const timestamp = new Date().getTime();
        const fileExtension = 'pdf';
        const fileName = `document_${timestamp}.${fileExtension}`;
        const filePath = path.join(documentDir, fileName);

        const buffer = await client.downloadMedia(mediaMessage);

        let content = buffer.toString("utf-8");

        jsonData.fileContent = content.replace(/^data:application\/pdf;base64,/, "");;

        fs.writeFileSync(filePath, buffer);
        console.log(`document salvo em: ${filePath}`);

        jsonData.mediaUrl = filePath;
        jsonData.mediaType = 'document';
        jsonData.mediaSize = buffer.length;
        jsonData.mediaMimeType = mime.lookup(fileExtension) || 'application/pdf';
        
      }

      if(mediaMessage.type === 'video') {
        console.log('Processando mensagem de video...');

        const videoDir = path.join(__dirname, 'media', 'video');
        if (!fs.existsSync(videoDir)) {
          fs.mkdirSync(videoDir, { recursive: true });
        }

        const timestamp = new Date().getTime();
        const fileExtension = 'mp4';
        const fileName = `video_${timestamp}.${fileExtension}`;
        const filePath = path.join(videoDir, fileName);

        const buffer = await client.downloadMedia(mediaMessage);

        let content = buffer.toString("utf-8");

        jsonData.fileContent = content.replace(/^data:video\/mp4;base64,/, "");
        fs.writeFileSync(filePath, buffer);
        console.log(`video salvo em: ${filePath}`);

        jsonData.mediaUrl = filePath;
        jsonData.mediaType = 'video';
        jsonData.mediaSize = buffer.length;
        jsonData.mediaMimeType = mime.lookup(fileExtension) || 'video/mp4';
        content
      }

      return jsonData;

    } catch (error) {
      console.error('Erro ao processar mídia:', error);
      throw error;
    }
  }

}

module.exports = SurveyBot;
