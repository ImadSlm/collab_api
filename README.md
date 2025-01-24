# API de Gestion de tâches collaboratives

## Description
Ce projet est une API qui permet aux utilisateurs de gérer des tâches et de collaborer avec les membres de l'équipe. Il offre des fonctionnalités telles que la création, la modification, la suppression de tâches et l'authentification des utilisateurs.

## Installation
Pour installer le projet, clonez le dépôt et installez les dépendances :
```bash
git clone https://github.com/yourusername/collab_api.git
cd collab_api
npm install
```

## Utilisation
Pour démarrer le serveur, exécutez la commande suivante :
```bash
npm start
```
Le serveur démarrera sur `http://localhost:3000`.

## Endpoints
- `POST /user` - Authentifier un utilisateur
- `POST /tasks` - Créer une nouvelle tâche
- `GET /tasks` - Obtenir toutes les tâches
- `PUT /task/:id` - Mettre à jour une tâche
- `DELETE /task/:id` - Supprimer une tâche$

## Docker
Pour utiliser ce projet avec Docker :

```bash
docker-compose up --build
```

### Étapes de conception :
1. **Analyse des besoins** : Identification des fonctionnalités nécessaires pour la gestion des tâches collaboratives.
2. **Conception de l'architecture** : Définition de l'architecture de l'API, choix des technologies (Node.js, Express, MariaDB).
3. **Mise en place de l'environnement de développement** : Configuration de l'environnement de développement, installation des dépendances.
4. **Développement des endpoints** : Création des routes pour l'authentification des utilisateurs et la gestion des tâches.
5. **Implémentation de la base de données** : Configuration de MariaDB pour stocker les utilisateurs et les tâches.
6. **Tests et débogage** : Tests unitaires, sécuritaires et d'intégration pour s'assurer du bon fonctionnement de l'API.
8. **Déploiement** : Déploiement de l'API sur un serveur de production.
