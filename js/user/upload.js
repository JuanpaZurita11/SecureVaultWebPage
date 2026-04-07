import { Encryption } from '../Crypto/Symmetric_Crypto.js';


const fileInput = document.getElementById('file-upload');
const fileMessage = document.getElementById('file-message');
const btnSend = document.getElementById('btn-send');
const backend = document.getElementById('datos-contactos');
const formulario = document.getElementById('formArchivo');
const encryptedFile = document.getElementById('encryptedFile');
const metadata = document.getElementById('metadata');

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


const MAX_FILE_SIZE = 1024 * 1024; // 1 MB en bytes

// Lógica de validación de archivo al seleccionarlo
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    // Resetear mensajes y estado del botón
    fileMessage.textContent = '';
    fileMessage.className = 'file-message';
    btnSend.disabled = true;

    if (!file) {
        return; // El usuario canceló la selección
    }

    if (file.size > MAX_FILE_SIZE) {
        // Archivo excede los 1 MB
        fileMessage.textContent = `Error: El archivo "${file.name}" supera los 1 MB permitidos.`;
        fileMessage.classList.add('error');
        fileInput.value = ''; // Limpiar el input para que no se pueda enviar
    } else {
        // Archivo válido
        fileMessage.innerHTML = `<i class="fa-solid fa-check"></i> Archivo listo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        fileMessage.classList.add('success');
        btnSend.disabled = false; // Habilitar el botón de envío
    }
});


formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    try{
        const cipher = new Encryption();
        const file = fileInput.files[0];

        const datos = JSON.parse(backend.textContent);
        const formatedRecipients = datos.recipients.map(item => ({
            username: item.usuario,
            key: item.llave_publica
        }));
        datos.recipients = formatedRecipients;
        datos.file_name = file.name;
        datos.type = file.type;

        const contenidoBuffer = await file.arrayBuffer();
        const datosCifrar = new Uint8Array(contenidoBuffer);
        datos.data = datosCifrar;

        const {cipherText, metaData} = await cipher.encrypt_file(datos);

        const jsonMetaData = JSON.stringify(metaData);

        /*
        const blob = new Blob([jsonMetaData],{type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'metadata.json';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        */
       descargar(jsonMetaData,'metadata.json','application/json');
       descargar(cipherText,file.name+".enc","application/octect-stream");
       alert("Se descargaron satisfactoriamente los archivos");


        /*
        metadata.value = jsonMetaData;

        const archivoCifrado = new File(
            [cipherText],
            file.name + ".enc",
            {type: 'application/octet-stream'}
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(archivoCifrado);

        encryptedFile.files = dataTransfer.files;
        */

    }
    catch (e){
        console.log(e);
    }
    /*
    formulario.submit();
    */
});
