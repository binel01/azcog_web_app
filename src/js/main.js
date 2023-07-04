import { BlobServiceClient } from '@azure/storage-blob';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

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
let messagesElement = document.getElementById('messages');

const reportStatus = message => {
    status.innerHTML = `${message}<br>`;
    status.scrollTop = status.scrollHeight;
};

const uploadFiles = async () => {
    try {
        reportStatus('Uploading files .....');
        const promises = [];
        for (const file of fileInput.files) {
            print(file.name);
            const blockBlobclient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobclient.uploadData(file));
        }
        await Promise.all(promises);
        reportStatus('Done.');
    }

    catch(error) {
        reportStatus(error.message);
    }
};


/**
 * Fonction permettant de gérer la connection à Azure SignalR Service
 */
const connect = () => {
// 1. Création de la connection au serveur Azure SignalR Service
const connection = new HubConnectionBuilder()
    .withUrl(negotiateUrl)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

// 2. Ecoute des messages venant du serveur web (Fonction Azure) et les affiche dans la page Html
connection.on('newMessage', (messages) => {
    for (const message of messages) {
        let messageJson = JSON.parse(message);
        let messageHtml = `
            <div class="images--list--item">
                <img src="${messageJson.image_url}" alt="" class="img">
                <p class="desc-en">${messageJson.description}</p>
                <p class="desc-fr">${messageJson.confidence}</p>
            </div> 
        `;
    
        messagesElement.innerHTML += messageHtml;
    }
});

// 3. Lorsque la connexion est refermée, relancer la connexion
connection.onclose(() => {
    console.log('SignalR connection disconnected');
    setTimeout(() => connect(), 2000);
});

// 4. Démarrage de la connection
connection.start()
    .then(() => {
        console.log('SignalR connection established');
    });
};

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    uploadFiles();
});


document.addEventListener('DOMContentLoaded', () => {
    // Démarrage de la connexion au chargement de la page
    connect();
});

