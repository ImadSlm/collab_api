CREATE DATABASE collabdb;

CREATE USER 'USERNAME_PLACEHOLDER' IDENTIFIED BY 'PASSWORD_PLACEHOLDER';

-- L'utilisateur n'a accès qu'à la BDD
GRANT SELECT, INSERT, UPDATE, DELETE ON collabdb.* TO 'USERNAME_PLACEHOLDER'@'%';

-- Utilisation de la base de données 'collabdb'
USE collabdb;