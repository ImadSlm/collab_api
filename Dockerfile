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
RUN npm install -g bcrypt newman dotenv

# Copie du reste des fichiers
COPY --chmod=777 . .

# Exposer le port de l'app
EXPOSE 3000

# commande pour éxecuter l'app
CMD ["npm", "start"]