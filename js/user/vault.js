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
});