document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORES PRINCIPALES ---
    const fileDisplay = document.getElementById('fileDisplay');
    const viewListBtn = document.getElementById('viewList');
    const viewGridBtn = document.getElementById('viewGrid');

    const uploadModal = document.getElementById('uploadModal');
    const deleteModal = document.getElementById('deleteModal');
    const accessModal = document.getElementById('accessModal');

    // --- 1. LÓGICA DE TOGGLE DE VISTA ---
    const toggleView = (view) => {
        if (view === 'grid') {
            fileDisplay.classList.remove('file-list-view');
            fileDisplay.classList.add('file-grid-view'); // Asegúrate de tener este CSS
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
        } else {
            fileDisplay.classList.remove('file-grid-view');
            fileDisplay.classList.add('file-list-view');
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
        }
    };

    viewListBtn.addEventListener('click', () => toggleView('list'));
    viewGridBtn.addEventListener('click', () => toggleView('grid'));

    // --- 2. LÓGICA DE MODALES (Abrir/Cerrar) ---
    const openModal = (modal) => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Evita scroll al fondo
    };

    const closeModal = (modal) => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    document.querySelectorAll('.close-btn, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(uploadModal);
            closeModal(deleteModal);
            closeModal(accessModal);
        });
    });

    // Cerrar al hacer clic fuera del cuadro blanco
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // --- 3. MODAL DE SUBIDA (UPLOAD) ---
    const btnUpload = document.querySelector('.btn-upload');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const btnSubmit = document.querySelector('.btn-submit');

    // Deshabilitar botón al cargar la página
    btnSubmit.disabled = true;

    const MAX_SIZE = 5 * 1024 * 1024;

    btnUpload.addEventListener('click', () => openModal(uploadModal));

    // Previsualización del nombre del archivo seleccionado
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file){
        if (file.size > MAX_SIZE){
          alert("El archivo es demasiado grande. El máximo permitido es 5 MB.");
          fileInput.value = ""; // Limpiar el input
          filePreview.classList.add('hidden');
          btnSubmit.disabled = true;
          return;
        }

      }
      fileNameDisplay.textContent = file.name;
      filePreview.classList.remove('hidden');
      btnSubmit.disabled = false;

    });

    // --- 4. MODAL DE ELIMINACIÓN (DELETE) ---
    const deleteFileTarget = document.getElementById('deleteFileTarget');
    const deleteFileName = document.getElementById('deleteFileName');

    // Usamos delegación de eventos para los botones de borrar (más eficiente)
    document.getElementById('fileBody').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.action-btn.delete');

        if (deleteBtn) {
            const row = deleteBtn.closest('.file-row');
            const fileId = row.dataset.id;
            const fileName = row.querySelector('.file-text').textContent;

            // Inyectar datos en el modal
            deleteFileTarget.value = fileId;
            deleteFileName.textContent = fileName;

            openModal(deleteModal);
        }
    });

    // --- 5. MODAL DE GESTIÓN DE ACCESOS (JSON) ---
    const accessFileId = document.getElementById('accessFileId');
    const jsonAccessInput = document.getElementById('jsonAccessInput');
    const jsonFeedback = document.getElementById('jsonFeedback');
    const saveAccessBtn = document.getElementById('saveAccessBtn');

    // 1. ABRIR Y CARGAR DATOS
    document.getElementById('fileBody').addEventListener('click', (e) => {
        const shareBtn = e.target.closest('.action-btn.share');

        if (shareBtn) {
            const row = shareBtn.closest('.file-row');
            const fileId = row.dataset.id;

            // Extraer el JSON del atributo del botón
            const rawData = shareBtn.dataset.destinatarios;
            let formattedJson = '{\n  \n}'; // Valor por defecto

            // Si hay datos, los formateamos para que se vean bien (con saltos de línea y sangría)
            if (rawData && rawData !== '[]' && rawData !== '{}' && rawData !== 'null') {
                try {
                    const parsedData = JSON.parse(rawData);
                    formattedJson = JSON.stringify(parsedData, null, 2); // El '2' añade la sangría
                } catch(err) {
                    console.error("Error al parsear el JSON existente:", err);
                }
            }

            // Asignar valores al modal
            accessFileId.value = fileId;
            jsonAccessInput.value = formattedJson;

            // Disparar el evento 'input' manualmente para que se valide de inmediato y se ponga verde
            jsonAccessInput.dispatchEvent(new Event('input'));

            openModal(accessModal);
        }
    });

    // 2. VALIDACIÓN (Esto se queda igual que antes)
    jsonAccessInput.addEventListener('input', () => {
        const value = jsonAccessInput.value.trim();

        if (value === "" || value === "{" || value === "{\n  \n}") {
            jsonFeedback.textContent = "";
            jsonAccessInput.classList.remove('is-invalid', 'is-valid');
            saveAccessBtn.disabled = true;
            return;
        }

        try {
            const parsed = JSON.parse(value);
            if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
                throw new Error("Debe ser un objeto: { 'usuario': 'llave' }");
            }

            jsonFeedback.innerHTML = "<i class='fa-solid fa-circle-check'></i> Formato JSON válido";
            jsonFeedback.className = 'feedback-text success';
            jsonAccessInput.classList.remove('is-invalid');
            jsonAccessInput.classList.add('is-valid');
            saveAccessBtn.disabled = false;
        } catch (e) {
            jsonFeedback.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> JSON inválido: Revisa comillas y comas.";
            jsonFeedback.className = 'feedback-text error';
            jsonAccessInput.classList.remove('is-valid');
            jsonAccessInput.classList.add('is-invalid');
            saveAccessBtn.disabled = true;
        }
    });

    // 3. GUARDAR CAMBIOS (AJAX / Fetch API)
    saveAccessBtn.addEventListener('click', async () => {
        const fileId = accessFileId.value;
        const jsonString = jsonAccessInput.value;

        // Feedback visual: cambiamos el botón a estado "cargando"
        const originalBtnText = saveAccessBtn.innerHTML;
        saveAccessBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
        saveAccessBtn.disabled = true;

        try {
            // Aquí haces la petición a tu backend PHP
            const response = await fetch('/ruta/a/tu/controlador_guardar_json.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_archivo: fileId,
                    destinatarios: JSON.parse(jsonString) // Mandamos el objeto limpio
                })
            });

            if (!response.ok) throw new Error('Error en el servidor');

            // Si se guardó bien, actualizamos el data-attribute en el HTML
            // Así si el usuario vuelve a abrir el modal, verá los cambios sin recargar la página
            const row = document.querySelector(`.file-row[data-id="${fileId}"]`);
            if (row) {
                const shareBtn = row.querySelector('.action-btn.share');
                // Guardamos la versión "limpia" de vuelta en el botón
                shareBtn.dataset.destinatarios = JSON.stringify(JSON.parse(jsonString));
            }

            closeModal(accessModal);

        } catch (error) {
            console.error('Error guardando:', error);
            jsonFeedback.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Error de conexión. Intenta de nuevo.";
            jsonFeedback.className = 'feedback-text error';
        } finally {
            // Restauramos el botón
            saveAccessBtn.innerHTML = originalBtnText;
            saveAccessBtn.disabled = false;
        }
    });
});