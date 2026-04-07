import { Encryption } from "../Crypto/Symmetric_Crypto.js";

const metaInput = document.getElementById('metadata-upload');
const fileInput = document.getElementById('file-upload');
const btnDecrypt = document.getElementById('btn-decrypt');

function descargar(contenido, nombre, tipo){
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const validateFiles = () => {
    const metaFile = metaInput.files[0];
    const encFile = fileInput.files[0];

    let metaValid = false;
    let encValid = false;

    // Validar Metadata
    if (metaFile) {
        if (metaFile.name.endsWith('.json')) {
            document.getElementById('metadata-message').innerHTML = `<i class="fa-solid fa-check"></i> Metadata lista.`;
            document.getElementById('metadata-message').className = 'file-message success';
            metaValid = true;
        } else {
            document.getElementById('metadata-message').textContent = 'Error: Debe ser un archivo .json';
            document.getElementById('metadata-message').className = 'file-message error';
        }
    }

    // Validar Archivo Cifrado
    if (encFile) {
        if (encFile.name.endsWith('.enc')) {
            document.getElementById('file-message').innerHTML = `<i class="fa-solid fa-check"></i> Archivo listo.`;
            document.getElementById('file-message').className = 'file-message success';
            encValid = true;
        } else {
            document.getElementById('file-message').textContent = 'Error: Debe ser un archivo .enc';
            document.getElementById('file-message').className = 'file-message error';
        }
    }

    // Habilitar botón solo si ambos son válidos
    btnDecrypt.disabled = !(metaValid && encValid);
};

metaInput.addEventListener('change', validateFiles);
fileInput.addEventListener('change', validateFiles);

const userDecryptData = document.getElementById('username');

const USERNAME = userDecryptData.dataset.username;
const PRIVATEKEY = userDecryptData.dataset.privatekey;

btnDecrypt.addEventListener('click', async () => {

    try{
        const metaInput = document.getElementById('metadata-upload').files[0];
        const fileInput = document.getElementById('file-upload').files[0];

        const metaText = await metaInput.text();
        const metaData = JSON.parse(metaText);

        const userCredential = metaData.recipients.find(r => r.username === USERNAME);
        if (!userCredential){
            alert("El usuario no tiene permiso para descifrar")
            return;
        }


        const cipher = new Encryption();

        const encBuffer = await fileInput.arrayBuffer();
        const cipherText = new Uint8Array(encBuffer);


        const decryptFile = await cipher.decrypt_file(metaData,cipherText,PRIVATEKEY,userCredential.key)
        const tipo = metaData.extension;
        descargar(decryptFile,"decifrado-"+metaData.file_name,tipo);
        alert("Se descargo el archivo descifrado");
    }
    catch (e){
        console.log(e);

    }

});