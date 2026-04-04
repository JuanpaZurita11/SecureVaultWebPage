document.addEventListener('DOMContentLoaded', () => {

    // --- BÚSQUEDA DE CONTACTOS ---
    const searchInput = document.getElementById('contactSearch');
    const contactRows = document.querySelectorAll('.contact-row');

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            contactRows.forEach(row => {
                const nameData = row.getAttribute('data-name');
                row.style.display = nameData.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // --- LÓGICA DEL MODAL DE ELIMINAR ---
    const deleteButtons = document.querySelectorAll('.btn-delete-contact');
    const deleteContactName = document.getElementById('deleteContactName');
    const deleteContactTarget = document.getElementById('deleteContactTarget');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = e.currentTarget.getAttribute('data-username');

            if (deleteContactName) deleteContactName.textContent = username;
            if (deleteContactTarget) deleteContactTarget.value = username;

            openModal('deleteContactModal');
        });
    });

    // Cerrar modales al hacer clic fuera de la caja blanca
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });
    });
});

// Funciones globales para abrir y cerrar modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add('hidden');
    }
}