document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DE MODALES (Aislada y Segura) ---
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('hidden');
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('hidden');
            // Si es el modal de añadir, limpiamos el input al cerrar
            if(modalId === 'addContactModal') {
                setTimeout(() => modal.querySelector('form').reset(), 200);
            }
        }
    };

    // Cerrar con los botones X o Cancelar
    document.querySelectorAll('.close-btn, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.currentTarget.closest('.modal-overlay');
            if(modal) closeModal(modal.id);
        });
    });

    // Cerrar tocando el fondo oscuro
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });


    // --- 2. APERTURA DE MODALES ---

    // Modal: Añadir Contacto
    const btnAddContact = document.getElementById('btnAñadirContacto');
    if(btnAddContact) {
        btnAddContact.addEventListener('click', () => openModal('addContactModal'));
    }

    // Modal: Eliminar Contacto
    const deleteButtons = document.querySelectorAll('.btn-delete-contact');
    const deleteContactName = document.getElementById('deleteContactName');
    const deleteContactTarget = document.getElementById('deleteContactTarget');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = e.currentTarget.dataset.username;
            const id = e.currentTarget.dataset.id;

            if (deleteContactName) deleteContactName.textContent = '@' + username;
            if (deleteContactTarget) deleteContactTarget.value = id;


            openModal('deleteContactModal');
        });
    });

});