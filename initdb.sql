CREATE DATABASE collabdb;

CREATE USER 'app_user' IDENTIFIED BY 'app_password';

-- username n'a accès qu'à la base mydb
GRANT SELECT, INSERT, UPDATE, DELETE ON collabdb.* TO 'app_user'@'localhost';

-- Utilisation de la base de données mydb
USE collabdb;