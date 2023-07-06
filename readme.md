# Azure Cognitive Static Web Application

## Description
Ce projet présente la partie frontend du projet Azure Cognitive qui permet d'uploader une image et d'obtenir la description de celle-ci.

La partie frontend est hébergée sur Azure App Service for Static Web Apps.

Et la partie backend se trouve au dépôt Github suivant : `https://github.com/binel01/azcog_func_app` et sera hébergée en tant que Azure Function Application.

N.B: Il est nécessaire de déployer la partie backend du projet avant de déployer la partie frontend dans ce dépôt.

## Installation
1.	Cloner le dépôt de code source, et modifier les variables :
    a.	Cloner le dépôt suivant https://github.com/binel01/azcog_web_app.git dans votre propre dépôt
    b.	Dans le fichier azcog_web_app/src/js/main.js remplacer blobSasUrl par la clé SAS pour accéder à blob Storage
    c.	Dans le fichier azcog_web_app/src/js/main.js remplacer negotiateUrl par l’url de la fonction negotiate utilisée précédemment créée
    d.	Dans le fichier azcog_web_app/src/js/main.js remplacer containerName par le nom du conteneur d’images 
    e.	Dans le fichier azcog_web_app/src/js/translate.js remplacer translateUrl déployée dans l'application backend
    f.	Faire un commit et pousser le code sur votre dépôt
2.	Créer le compte de service App Service for Static Web Apps
3.	Créer le compte de stockage lié à l’application web
4.	Configurer le dépôt de code comme source
5.	La création de cette application entraînera le déploiement de l’application


## Utilisation
1.	Ouvrir le lien dans le navigateur
2.	Attendre que le statut affiche : Connecté au serveur (SignalR)
3.	Une fois que l’application est connectée, vous pouvez téléverser votre image
4.	Une fois le téléversement terminé, le statut sera : Image téléversée
5.	Une fois l’image téléversée, il faudra patienter quelques secondes pour voir le statut : la description de l’image est reçue
6.	Vous verrez apparaître dans le tableau en dessous l’image, sa description ainsi que la précision


## Axes d'amélioration
- Corriger le bug d’impression d’écran lorsqu’on clique sur le bouton pour téléverser l’image
- Améliorer l’application App Service afin de stocker les informations de configuration du frontend dans des variables d’environnement
- Créer un projet Terraform afin d’automatiser la création de ressources et le déploiement de la solution
- Envoyer la description des images uniquement vers les clients qui ont uploadé cette image et non à tous les clients
- Créer une règle dans Blob Storage afin de supprimer les images enregistrées qui ont passé un délai, comme 3 jours afin d’économiser les ressources de stockage
- Créer une procédure stockée dans Cosmos DB afin de supprimer toutes en entrés en BD qui ont plus de 3 jours afin d’économiser en ressources de stockage
