# Config nodejs pour le conteneur
FROM node:18-alpine

# Repertoire de travail
WORKDIR /app


# Copie config du projet
COPY package*.json ./

# Installation les dépendances
RUN npm install

# Rebuild des modules natifs
# RUN npm rebuild bcrypt --build-from-source
# RUN npm install -g bcrypt
RUN npm install -g bcrypt newman dotenv

# Copie du reste des fichiers
COPY . .

# Exposer le port de l'app
EXPOSE 3003

# commande pour éxecuter les tests
CMD ["npm", "run","test"]

# CMD ["sh", "-c", "npm run test && newman run /app/tests/postman/collabdb.postman_collection.json"]