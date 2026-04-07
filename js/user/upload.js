document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const fileMessage = document.getElementById('file-message');
    const btnSend = document.getElementById('btn-send');

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes

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
            // Archivo excede los 5 MB
            fileMessage.textContent = `Error: El archivo "${file.name}" supera los 5 MB permitidos.`;
            fileMessage.classList.add('error');
            fileInput.value = ''; // Limpiar el input para que no se pueda enviar
        } else {
            // Archivo válido
            fileMessage.innerHTML = `<i class="fa-solid fa-check"></i> Archivo listo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            fileMessage.classList.add('success');
            btnSend.disabled = false; // Habilitar el botón de envío
        }
    });
});