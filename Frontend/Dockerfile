# Usa a imagem do Node.js para construir o frontend
FROM node:22 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do frontend para dentro do container
COPY package.json package-lock.json ./
RUN npm install --force

# Copia o restante dos arquivos e faz o build
COPY . .
RUN npm run build

# Usa a imagem do Nginx para servir os arquivos estáticos
FROM nginx:latest

# Copia os arquivos do build para a pasta padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
