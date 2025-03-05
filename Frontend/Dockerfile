# Usa a imagem do Nginx para servir os arquivos estáticos
FROM nginx:latest

# Define o diretório de trabalho dentro do container
WORKDIR /usr/share/nginx/html

# Copia os arquivos de build do seu computador local para o container
COPY ./build /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
