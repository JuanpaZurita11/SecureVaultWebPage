document.addEventListener('DOMContentLoaded', () => {

    // Preparado para la descarga con el icono
    const downloadButtons = document.querySelectorAll('.action-btn.download');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Aquí iría tu fetch a /vault/download
            alert("Descargando archivo cifrado...");
        });
    });

});