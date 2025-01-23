# API de Collaboration

## Description
Ce projet est une API collaborative qui permet aux utilisateurs de gérer des tâches et de collaborer avec les membres de l'équipe. Il offre des fonctionnalités telles que la création, la modification
<!-- , la suppression de tâches et l'authentification des utilisateurs. -->

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
<!-- - `PUT /task/:id` - Mettre à jour une tâche
- `DELETE /task/:id` - Supprimer une tâche -->

### TO DO :
- Faire test sécuritaires et test unitaires
- hachage de MDP
- automatiser les testes des routes avec postman
- ajouter modif et suppression de taches