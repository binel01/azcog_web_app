import { BlobServiceClient } from '@azure/storage-blob';

// Clé de signature d'accès partagée
const blobSasUrl = 'https://azcogtoragebineli1.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-07-28T23:09:52Z&st=2023-06-27T15:09:52Z&spr=https&sig=JCi5ZJwenF8%2B2A1%2F%2BJ0AzTa2HAPTewD0tNoY6LuIZu8%3D';

// Nom du conteneur
const containerName = 'images';

// Créer un nouveau service BlobServiceclient
const blobserviceClient = new BlobServiceClient(blobSasUrl);

// Récupérer le client du conteneur
const containerClient = blobserviceClient.getContainerClient(containerName);

const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('file-input');
//const submitButton = document.getElementById('submit');
const status = document.getElementById('status');

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
            //promises.push(blockBlobclient.uploadBrowserData(file));
        }
        await Promise.all(promises);
        //.then(ressult => {
        //    console.log(ressult);
        //});
        reportStatus('Done.');
    }

    catch(error) {
        reportStatus(error.message);
    }
};

//submitButton.addEventListener('click', () => uploadFiles);
//submitButton.addEventListener('click', () => fileInput.click());
//fileInput.addEventListener('change', uploadFiles);

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    uploadFiles();
});
