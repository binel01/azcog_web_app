import axios from 'axios';
// URL de la fonction negotiate
const translateUrl = 'https://azcogfuncapp.azurewebsites.net/api/';
//const translateLocal = 'http://localhost:7071/api/translate';

/**
 * Permet d'obtenir la langue choisie par l'utilisateur
 * @returns La langue choisie par l'utilisateur
 */
export function getSelectedLanguage() {
    let selectElement = document.getElementById('select-language');
    let language = selectElement.selectedOptions[0].value;

    return language;
}

/**
 * Permet de traduire une texte en l'anglais `text` vers la langue de destination `toLanguage`
 * @param {String} text Texte à traduire
 * @param {String} toLanguage Langue de destination de la traduction
 */
export function translateText(text, toLanguage) {
    // 1. Importer le SDK de Azure Translate
    console.log('Texte : ' + text);
    console.log('toLanguage : ' + toLanguage);

    // 2. Exécuter la traduction du texte
    return axios({
        baseURL: translateUrl,
        url: '/translate',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        params: {
            'api-version': '3.0',
            'from': 'en',
            'to': ['fr-FR']
        },
        data: JSON.stringify({
            'text': text,
            'dest_lang': toLanguage
        }),
        responseType: 'json'
    }).then(async function(response){
        //console.log(response.data);
        return response.data[0].translations[0].text;
    });
}
