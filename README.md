# MEMORY "jeux de mémoire"
### Installation 

Il est possible d'utiliser docker pour déployer l'application en utilisant la commande suivante :
```
$docker-compose up -d --build
```
L'aplication sera alors accessible sur le port 8000(localhost:8000) et la base de données sur 8080 (localhost:8080)

... ou installez le sur votre système manuellement, en prenant soin de créer la base "memory", et d'utiliser le script 
dans le dossier docker/db/scripts pour créer la table.

### Configuration
Pour l'accès à la base de données, la configuration se fera en haut du fichier Server/Db/Connector.php


####Bon jeu !
