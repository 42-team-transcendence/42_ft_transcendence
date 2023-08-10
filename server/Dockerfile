# Base image
# FROM node:16-alpine
FROM node:18

# Create a non-root user and switch to it
# This should help avoid permission issues when accessing the /root/.npm directory.
# RUN adduser -D myuser
# USER myuser
WORKDIR /app

COPY ./bin/entrypoint.sh /usr/bin/entrypoint.sh

# RUN npm config set cache /tmp --global

# installation de toutes les dépendances nécessaires listées dans package.json

# Copier tous nos fichiers du dossier courant (serveur) dans notre image

# RUN sudo chown -R 1000:1000 "/root/.npm"
# Change ownership of /root/.npm directory to the root user
# RUN chown -R root:root /root/.npm

# Génération du code du client prisma, 
# qu'on pourra ensuite utiliser dans le code pour communiquer avec la DB


# script executed from package.json
# CMD ["npm", "run", "start:debug:docker"]
# CMD ["sleep", "100000000"]

ENTRYPOINT [ "/bin/sh", "/usr/bin/entrypoint.sh" ]
