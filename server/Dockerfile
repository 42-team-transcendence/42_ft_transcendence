# Base image
# FROM node:16-alpine
FROM node:18

# Create a non-root user and switch to it
# This should help avoid permission issues when accessing the /root/.npm directory.
# RUN adduser -D myuser
# USER myuser

# Create app directory and go into it
RUN mkdir -p /app
WORKDIR /app


# Change ownership of /app directory to the node user (non-root user within the Node.js Docker image)
RUN chown root:root . 
# RUN chown -R node:node /app

# Switch to the node user
# USER node

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./


# RUN npm install -g npm@latest
# RUN npm install -g @nestjs/cli

# RUN npm config set cache /tmp --global

# installation de toutes les dépendances nécessaires listées dans package.json
RUN npm install

# Copier tous nos fichiers du dossier courant (serveur) dans notre image
COPY . .

# RUN sudo chown -R 1000:1000 "/root/.npm"
# Change ownership of /root/.npm directory to the root user
# RUN chown -R root:root /root/.npm

# Génération du code du client prisma, 
# qu'on pourra ensuite utiliser dans le code pour communiquer avec la DB
RUN npx prisma generate


# script executed from package.json
CMD ["npm", "run", "start:debug:docker"]