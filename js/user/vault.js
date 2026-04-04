document.addEventListener('DOMContentLoaded', () => {

    // --- BÚSQUEDA ---
    const searchInput = document.getElementById('vaultSearch');
    const fileRows = document.querySelectorAll('.file-row');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            fileRows.forEach(row => {
                row.style.display = row.getAttribute('data-name').includes(term) ? '' : 'none';
            });
        });
    }

    // --- VISTAS (LISTA/GRID) ---
    const btnList = document.getElementById('viewList');
    const btnGrid = document.getElementById('viewGrid');
    const fileDisplay = document.getElementById('fileDisplay');
    if(btnList && btnGrid) {
        btnGrid.addEventListener('click', () => {
            btnGrid.classList.add('active'); btnList.classList.remove('active');
            fileDisplay.className = 'file-grid-view';
        });
        btnList.addEventListener('click', () => {
            btnList.classList.add('active'); btnGrid.classList.remove('active');
            fileDisplay.className = 'file-list-view';
        });
    }

    // --- MODALES GENERALES ---
    const openModal = (modalId) => document.getElementById(modalId)?.classList.remove('hidden');
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('hidden');
            if(modalId === 'uploadModal') {
                setTimeout(() => {
                    document.getElementById('uploadForm').reset();
                    document.getElementById('filePreview').classList.add('hidden');
                    document.querySelector('.file-drop-area').classList.remove('dragover');
                }, 200);
            }
        }
    };

    // Botón Subir
    document.querySelector('.btn-upload')?.addEventListener('click', () => openModal('uploadModal'));

    // Botones de Compartir (Accesos)
    document.querySelectorAll('.action-btn.share').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filename = e.currentTarget.getAttribute('data-filename');
            document.getElementById('accessFileName').textContent = filename;
            openModal('accessModal');
        });
    });

    // Cerrar Modales (X y Cancelar)
    document.querySelectorAll('.close-btn, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => closeModal(e.currentTarget.getAttribute('data-modal')));
    });

    // Cerrar al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });

    // --- DRAG & DROP (MODAL SUBIDA) ---
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const dropArea = document.querySelector('.file-drop-area');

    if(fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                filePreview.classList.remove('hidden');
            } else {
                filePreview.classList.add('hidden');
            }
        });
        fileInput.addEventListener('dragenter', () => dropArea.classList.add('dragover'));
        fileInput.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
        fileInput.addEventListener('drop', () => dropArea.classList.remove('dragover'));
    }

    // --- LÓGICA DE CONFIRMACIÓN DE BORRADO ---
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    const deleteFileName = document.getElementById('deleteFileName');
    const deleteFileTarget = document.getElementById('deleteFileTarget');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 1. Buscamos la fila del archivo a la que pertenece este botón
            const fileRow = e.currentTarget.closest('.file-row');

            // 2. Extraemos el nombre del archivo del atributo data-name que ya teníamos
            const filename = fileRow.getAttribute('data-name');

            // 3. Escribimos ese nombre en el modal para que el usuario sepa qué va a borrar
            if (deleteFileName) deleteFileName.textContent = filename;

            // 4. Ponemos el nombre (o ID) en el input oculto para que PHP sepa qué borrar
            if (deleteFileTarget) deleteFileTarget.value = filename;

            // 5. Abrimos el modal
            openModal('deleteModal');
        });
    });

    // --- LÓGICA DE TRANSFERENCIA DE CONTACTOS (MODAL 2) ---
    const activeUsersList = document.getElementById('activeUsersList');
    const availableUsersList = document.getElementById('availableUsersList');

    // Función para manejar el clic en los botones de Agregar/Quitar
    const handleAccessToggle = (e) => {
        // Verifica si se hizo clic en el botón de QUITAR
        if (e.target.closest('.btn-remove-access')) {
            const item = e.target.closest('.access-user-item');
            const checkbox = item.querySelector('input[type="checkbox"]');
            const btn = item.querySelector('.btn-remove-access');

            // 1. Desmarcar checkbox
            checkbox.checked = false;

            // 2. Cambiar clases y botón para que parezca un item de "Agregar"
            item.className = 'contact-item addable-item';
            btn.className = 'btn-add-access';
            btn.innerHTML = '<i class="fa-solid fa-user-plus"></i>';
            btn.title = 'Dar acceso';

            // 3. Cambiar color del avatar a verde (estilo de contactos disponibles)
            item.querySelector('.contact-avatar').style.cssText = 'background: #f0fdf4; color: #16a34a;';

            // 4. Mover a la lista de abajo
            availableUsersList.appendChild(item);
        }

        // Verifica si se hizo clic en el botón de AGREGAR
        if (e.target.closest('.btn-add-access')) {
            const item = e.target.closest('.contact-item');
            const checkbox = item.querySelector('input[type="checkbox"]');
            const btn = item.querySelector('.btn-add-access');

            // 1. Marcar checkbox
            checkbox.checked = true;

            // 2. Cambiar clases y botón para que parezca un item de "Acceso actual"
            item.className = 'access-user-item';
            btn.className = 'btn-remove-access';
            btn.innerHTML = '<i class="fa-solid fa-user-minus"></i>';
            btn.title = 'Revocar acceso';

            // 3. Cambiar color del avatar al azul normal
            item.querySelector('.contact-avatar').style.cssText = 'background: #dbeafe; color: #1d4ed8;';

            // 4. Mover a la lista de arriba
            activeUsersList.appendChild(item);
        }
    };

    // Escuchamos los clics en los contenedores padres (Delegación de eventos)
    if(activeUsersList) activeUsersList.addEventListener('click', handleAccessToggle);
    if(availableUsersList) availableUsersList.addEventListener('click', handleAccessToggle);
});