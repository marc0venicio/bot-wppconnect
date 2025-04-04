require('dotenv').config();
const MessageService = require('./services/MessageService');
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const { initializeClient } = require('./services/WppClient');
const routes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 5555;

// app.engine('.hbs', engine({ extname: '.hbs' }));
// app.set('view engine', '.hbs');
// app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

setInterval(async () => {
  await MessageService.checkAndProcessMessages();
}, 5000);

(async () => {
  try {
      await initializeClient(); // Chama a função do bot
  } catch (error) {
      console.error('Erro ao inicializar o SurveyBot:', error);
  }
})();

app.listen(port, () => {
    console.log(`Servidor PAINEL rodando em http://localhost:${port}`);
});