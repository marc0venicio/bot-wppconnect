const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect.create({
  session: 'sessionName',
  catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
    console.log('Number of attempts to read the qrcode: ', attempts);
    console.log('Terminal qrcode: ', asciiQR);
    console.log('base64 image string qrcode: ', base64Qrimg);
    console.log('urlCode (data-ref): ', urlCode);
  },
  statusFind: (statusSession, session) => {
    console.log('Status Session: ', statusSession);
    console.log('Session name: ', session);
  },
  headless: true,
  devtools: false,
  useChrome: true,
  debug: false,
  logQR: true,
  browserWS: '',
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  puppeteerOptions: {},
  disableWelcome: false,
  updatesLog: true,
  autoClose: 60000,
  tokenStore: 'file',
  folderNameToken: './tokens',
})
.then((client) => start(client))
.catch((error) => console.log('❌ Erro ao iniciar:', error));

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'ping') {
      client.sendText(message.from, 'pong');
    }
  });
}
