require('dotenv').config();
const MessageService = require('./services/MessageService');
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const routes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 5555;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

setInterval(async () => {
  await MessageService.checkAndProcessMessages();
}, 5000);

app.listen(port, async () => {
    console.log(`Servidor PAINEL rodando em http://localhost:${port}`);
});