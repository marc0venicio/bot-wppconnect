
const handleMediaMessage = async (clientId, message, jsonData) => {
    console.log("Receiving media:", message.type);
    
    jsonData['messageType'] = message.isGif ? 'gif' : message.type;
    
    if (message['_data']?.caption) {
        jsonData['fileCaption'] = message['_data'].caption;
    }
    
    return jsonData;
};

const handleLocationMessage = async (clientId, message, jsonData) => {
    console.log("Location message received.");
    
    jsonData['messageType'] = 'location';
    jsonData['location'] = {
        latitude: message.lat,
        longitude: message.lng,
        address: message.address || ''
    };

    return jsonData;
};

const handleButtonResponseMessage = async (clientId, message, jsonData) => {
    console.log(" Button response received.");
    
    jsonData['messageType'] = 'buttons_response';
    jsonData['buttonResponse'] = message.selectedButtonId || '';

    return jsonData;
};

const handleChatMessage = async (clientId, jsonData) => {
    console.log(" Chat message received.");
    
    jsonData['messageType'] = 'chat';
    return jsonData;
};

module.exports = {
    handleMediaMessage,
    handleLocationMessage,
    handleButtonResponseMessage,
    handleChatMessage
};
