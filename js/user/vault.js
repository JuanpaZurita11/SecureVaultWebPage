document.addEventListener('DOMContentLoaded', () => {

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

    // --- LÓGICA DE MODALES (COMO LA TENÍAS ORIGINALMENTE) ---
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('hidden');
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('hidden');
            if(modalId === 'uploadModal') {
                setTimeout(() => {
                    document.getElementById('uploadForm')?.reset();
                    document.getElementById('filePreview')?.classList.add('hidden');
                    document.querySelector('.file-drop-area')?.classList.remove('dragover');
                }, 200);
            }
        }
    };

    // Botón Subir
    const btnUpload = document.querySelector('.btn-upload');
    if(btnUpload) {
        btnUpload.addEventListener('click', () => openModal('uploadModal'));
    }

    // Botones de Compartir (Accesos)
    document.querySelectorAll('.action-btn.share').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Buscamos el nombre directamente de la fila como lo hacías antes
            const fileRow = e.currentTarget.closest('.file-row');
            const filename = fileRow ? fileRow.getAttribute('data-name') : 'archivo';
            document.getElementById('accessFileName').textContent = filename;
            openModal('accessModal');
        });
    });

    // Cerrar Modales (X y Cancelar)
    document.querySelectorAll('.close-btn, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Buscamos el modal padre para cerrarlo
            const modal = e.currentTarget.closest('.modal-overlay');
            if(modal) closeModal(modal.id);
        });
    });

    // Cerrar al hacer clic fuera (en el overlay oscuro)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });

    // LÓGICA DE CONFIRMACIÓN DE BORRADO
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    const deleteFileName = document.getElementById('deleteFileName');
    const deleteFileTarget = document.getElementById('deleteFileTarget');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileRow = e.currentTarget.closest('.file-row');
            const filename = fileRow ? fileRow.getAttribute('data-name') : 'archivo';

            if (deleteFileName) deleteFileName.textContent = filename;
            if (deleteFileTarget) deleteFileTarget.value = filename;

            openModal('deleteModal');
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

    // --- LÓGICA DE TRANSFERENCIA DE CONTACTOS (MODAL 2) ---
    const activeUsersList = document.getElementById('activeUsersList');
    const availableUsersList = document.getElementById('availableUsersList');

    const handleAccessToggle = (e) => {
        if (e.target.closest('.btn-remove-access')) {
            const item = e.target.closest('.access-user-item');
            const checkbox = item.querySelector('input[type="checkbox"]');
            const btn = item.querySelector('.btn-remove-access');

            checkbox.checked = false;
            item.className = 'contact-item addable-item';
            btn.className = 'btn-add-access';
            btn.innerHTML = '<i class="fa-solid fa-user-plus"></i>';
            btn.title = 'Dar acceso';
            item.querySelector('.contact-avatar').style.cssText = 'background: #f0fdf4; color: #16a34a;';

            availableUsersList.appendChild(item);
        }

        if (e.target.closest('.btn-add-access')) {
            const item = e.target.closest('.contact-item');
            const checkbox = item.querySelector('input[type="checkbox"]');
            const btn = item.querySelector('.btn-add-access');

            checkbox.checked = true;
            item.className = 'access-user-item';
            btn.className = 'btn-remove-access';
            btn.innerHTML = '<i class="fa-solid fa-user-minus"></i>';
            btn.title = 'Revocar acceso';
            item.querySelector('.contact-avatar').style.cssText = 'background: #dbeafe; color: #1d4ed8;';

            activeUsersList.appendChild(item);
        }
    };

    if(activeUsersList) activeUsersList.addEventListener('click', handleAccessToggle);
    if(availableUsersList) availableUsersList.addEventListener('click', handleAccessToggle);
});