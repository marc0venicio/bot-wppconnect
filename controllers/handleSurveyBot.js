const SurveyBot = require("../services/SurveyBot");

const handleSurveyBot = async (body) => {

    const bot = new SurveyBot();

    const message = {
        json: body,
        msgBody: body.body,
        msgType: body.type,
        phoneFrom: body.from.replace("@c.us", ""),
        phoneTo: body.to.replace("@c.us", ""),
        phoneId: body.from,
        status: 2,
        msgId: null,
    };

    const response = await bot.storeMessage(message);

    return true;
}

module.exports = handleSurveyBot;