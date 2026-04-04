document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE DESCARGA DE ARCHIVOS PÚBLICOS ---
    // Escuchamos clics en toda la página (Delegación segura)
    document.body.addEventListener('click', (e) => {

        // Verificamos si lo que se clicó es el botón de descarga
        const btnDownload = e.target.closest('.action-btn.download');

        if (btnDownload) {
            e.preventDefault();

            // Obtenemos el nombre del archivo de la fila (data-name)
            const fileRow = btnDownload.closest('.file-row');
            const filename = fileRow ? fileRow.getAttribute('data-name') : 'archivo';

            // Aquí iría tu fetch a /vault/download
            alert(`Descargando archivo cifrado: ${filename}`);
        }
    });

});