import { create } from "@wppconnect-team/wppconnect";

await create({
  puppeteerOptions: {
      executablePath: '/home/marco/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome', // ou caminho do Chrome no WSL, se estiver instalado
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

console.log("Cliente WPPConnect inicializado!");