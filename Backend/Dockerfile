# Usa a versão 22 do Node.js
FROM node:22

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos do projeto para o contêiner
COPY package.json package-lock.json ./
RUN npm install

# Copia todo o código para dentro do contêiner
COPY . .

# Expõe a porta do backend
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
