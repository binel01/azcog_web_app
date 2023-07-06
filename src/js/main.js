import { BlobServiceClient } from '@azure/storage-blob';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getSelectedLanguage, translateText } from './translation';

// Clé de signature d'accès partagée
const blobSasUrl = 'https://azcogtoragebineli1.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-07-28T23:09:52Z&st=2023-06-27T15:09:52Z&spr=https&sig=JCi5ZJwenF8%2B2A1%2F%2BJ0AzTa2HAPTewD0tNoY6LuIZu8%3D';

// URL de la fonction negotiate
const negotiateUrl = 'https://azcogfuncapp.azurewebsites.net/api/';

// Nom du conteneur
const containerName = 'images';

// Créer un nouveau service BlobServiceclient
const blobserviceClient = new BlobServiceClient(blobSasUrl);

// Récupérer le client du conteneur
const containerClient = blobserviceClient.getContainerClient(containerName);

const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('file-input');
const status = document.getElementById('status');
const submitBtn = document.getElementById('submit');
//let messagesElement = document.getElementById('messages');

/**
 * Fonction permettant d'afficher un message sur la page web
 * @param {String} message Message à afficher
 */
const reportStatus = message => {
    status.innerHTML += `${message}<br>`;
    status.scrollTop = status.scrollHeight;
};

/**
 * Fonction permettant d'uploder un fichier dans le stockage Azure Blob
 */
const uploadFiles = async () => {
    try {
        reportStatus('Téléversement de l\'image .....');
        const promises = [];
        for (const file of fileInput.files) {
            print(file.name);
            const blockBlobclient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobclient.uploadData(file));
        }
        await Promise.all(promises);
        reportStatus('Image téléversée');
    }

    catch(error) {
        reportStatus('Echec de téléversement : ' + error.message);
    }
};

/**
 * Fonction permettant d'afficher l'image et sa description dans la page web
 * @param {Object} image Image qui doit être affichée dans la page web
 */
function displayImageDescription(image) {
    // Convertir confidence en float à 2 décimales près et en pourcentage
    let valeur = image.confidence;
    let arrondi = valeur.toFixed(4); // Arrondir à 2 décimales
    let pourcentage = (arrondi * 100).toFixed(2) + '%'; // Convertir en pourcentage

    let tableElement = document.getElementById('images-table');
    let row = tableElement.insertRow();
    row.insertCell().innerHTML = `<img src="${image.image_url}" alt="" class="img desc">`;
    row.insertCell().innerHTML = `<span class="desc">${image.description}</span>`;
    row.insertCell().innerHTML = `<span class="desc">${pourcentage}</span>`;
}


/**
 * Fonction permettant de gérer la connection à Azure SignalR Service
 */
const connect = async () => {
    // 1. Création de la connection au serveur Azure SignalR Service
    const connection = new HubConnectionBuilder()
        .withUrl(negotiateUrl)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    reportStatus('En cours de connexion au serveur');

    // 2. Ecoute des messages venant du serveur web (Fonction Azure) et les affiche dans la page Html
    connection.on('newMessage', async (messages) => {
        // Parser le message reçu au format JSON
        let message_str = JSON.parse(messages);
        // Il faut parser une seconde fois pour obtenir un objet JSON
        let messageJson = JSON.parse(message_str);
        console.log(messageJson);

        // Traduire la description dans la langue de l'utilisateur si nécessaire
        let userLanguage = getSelectedLanguage();
        if (userLanguage != 'en') {
            translateText(messageJson.description, userLanguage)
                .then(message => {
                    messageJson.description = message;

                    console.log('Image description translated');
                    reportStatus('La description de l\'image est reçue !');
                    displayImageDescription(messageJson);
                })
                .catch(err => {
                    displayImageDescription(messageJson);
                    console.log(err);
                });
        }
        else {
            reportStatus('La description de l\'image est reçue !');
            displayImageDescription(messageJson);
        }
    });

    // 3. Lorsque la connexion est refermée, relancer la connexion
    connection.onclose(() => {
        reportStatus('Déconnecté du serveur');
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    // 4. Démarrage de la connection
    connection.start()
        .then(() => {
            reportStatus('Connecté au serveur');
            console.log('SignalR connection established');
        });
};

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();


    const eventSubmit = new Event('submit', {bubbles: true, cancelable: true});
    uploadForm.dispatchEvent(eventSubmit);
    //uploadForm.submit();

    uploadFiles();
});




document.addEventListener('DOMContentLoaded', async () => {
    // Démarrage de la connexion au chargement de la page
    connect();
});

