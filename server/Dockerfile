# Base image
FROM node:16-alpine

# Create app directory and go into it
RUN mkdir -p /app
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# installation de toutes les dépendances nécessaires listées dans package.json
RUN npm install

# Copier tous nos fichiers du dossier courant (serveur) dans notre image
COPY . .

# RUN npm i -g @nestjs/cli

# Value set in .env file.
EXPOSE $BACKEND_PORT

# Génération du code du client prisma, 
# qu'on pourra ensuite utiliser dans le code pour communiquer avec la DB
RUN npx prisma generate

# # 
# RUN npx prisma migrate deploy --schema='./app/prisma/schema.prisma' --preview-feature
#     npx prisma db push --schema='./app/prisma/schema.prisma' --preview-feature

# script executed from package.json
CMD ["npm", "run", "start:debug:docker"]