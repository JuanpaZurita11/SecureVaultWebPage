document.addEventListener('DOMContentLoaded', () => {

    // 1. Referencias al Modal y al Formulario
    const modal = document.getElementById('modalConfirmacion');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    // Referencias a los inputs ocultos de tu formulario PHP
    const inputAction = document.querySelector('input[name="action"]');
    const inputId = document.querySelector('input[name="id"]');

    // 2. Función para cerrar (global para poder usar onclick="closeModal()")
    window.closeModal = () => {
        modal.classList.add('hidden');
    };

    // 3. Delegación de eventos: Escuchamos clics en toda la página
    document.body.addEventListener('click', (e) => {

        // --- LÓGICA DE DESCARGA ---
        const btnDownload = e.target.closest('.action-btn.download');
        if (btnDownload) {
            e.preventDefault();
            const fileRow = btnDownload.closest('.file-row');
            const filename = fileRow ? fileRow.getAttribute('data-name') : 'archivo';
            alert(`Descargando archivo cifrado: ${filename}`);
            return; // Detenemos aquí para que no siga ejecutando código
        }

        // --- LÓGICA DE CONTACTOS ---
        const btnContact = e.target.closest('.btn-contact-action');
        if (btnContact) {
            // Obtenemos los datos del botón que fue clickeado
            const action = btnContact.getAttribute('data-action'); // 'add' o 'del'

            // Actualizamos los inputs ocultos de tu formulario PHP
            inputAction.value = action;

            // Personalizamos el texto del modal según la acción
            if (action === 'add') {
                modalTitle.innerText = 'Añadir contacto';
                modalMessage.innerText = '¿Deseas añadir a este usuario a tu lista de contactos?';
            } else {
                modalTitle.innerText = 'Eliminar contacto';
                modalMessage.innerText = '¿Estás seguro de que quieres eliminar este contacto?';
            }

            // Mostramos el modal
            modal.classList.remove('hidden');
        }
    });
});