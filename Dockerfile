FROM node:18-slim

# Chrome dependencies
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libgbm1 \
  libnss3 \
  libxshmfence1 \
  libx11-xcb1 \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Cria diretório da app
WORKDIR /app

# Copia e instala pacotes
COPY package*.json ./
RUN npm install

# Copia restante
COPY . .

# Porta padrão do wppconnect (se usar server)
EXPOSE 21465

CMD [ "node", "index.js" ]
