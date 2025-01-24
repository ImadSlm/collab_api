# Config nodejs pour le conteneur
FROM node:18-alpine

# Repertoire de travail
WORKDIR /app


# Copie config du projet
COPY ./package*.json .

RUN ls

# Installation les dépendances
RUN npm install

RUN npm list

# Rebuild des modules natifs
# RUN npm rebuild bcrypt --build-from-source
RUN npm install -g bcrypt
RUN npm install -g newman dotenv

# Copie du reste des fichiers
COPY . .

# Exposer le port de l'app
EXPOSE 3000

# commande pour éxecuter l'app
CMD ["npm", "start"]