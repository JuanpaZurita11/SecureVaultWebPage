
// --- SELECTORES PRINCIPALES ---
const fileDisplay = document.getElementById('fileDisplay');
const viewListBtn = document.getElementById('viewList');
const viewGridBtn = document.getElementById('viewGrid');

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

// =========================================
// 5. MODAL DE GESTIÓN DE ACCESOS (JSON)
// =========================================

const accessFileId = document.getElementById('accessFileId');
const jsonAccessInput = document.getElementById('jsonAccessInput');
const jsonFeedback = document.getElementById('jsonFeedback');
const saveAccessBtn = document.getElementById('saveAccessBtn');
const updateFileTarget = document.getElementById('updateFileTarget');
const recipients = document.getElementById('shareList');

// 1. ABRIR MODAL Y CARGAR DATOS
document.getElementById('fileBody').addEventListener('click', (e) => {
    const shareBtn = e.target.closest('.action-btn.share');

    if (shareBtn) {
        const row = shareBtn.closest('.file-row');
        const fileId = row.dataset.id;

        // Extraer el JSON del atributo del botón (inyectado por PHP)
        const rawData = shareBtn.dataset.destinatarios;
        let formattedJson = '{\n  \n}'; // Plantilla por defecto

        if (rawData && rawData !== '[]' && rawData !== '{}' && rawData !== 'null') {
            try {
                const parsedData = JSON.parse(rawData);
                // Formatear con sangría de 2 espacios para facilitar la lectura
                formattedJson = JSON.stringify(parsedData, null, 2);
            } catch(err) {
                console.error("Error al parsear el JSON existente:", err);
            }
        }

        // Asignar valores al modal
        accessFileId.value = fileId;
        jsonAccessInput.value = formattedJson;

        updateFileTarget.value = fileId;

        // Disparar la validación visual inmediatamente al abrir
        jsonAccessInput.dispatchEvent(new Event('input'));

        openModal(accessModal);
    }
});

// 2. VALIDACIÓN EN TIEMPO REAL
jsonAccessInput.addEventListener('input', () => {
    const value = jsonAccessInput.value.trim();

    // Estado inicial o vacío
    if (value === "" || value === "{" || value === "{\n  \n}") {
        jsonFeedback.textContent = "";
        jsonAccessInput.classList.remove('is-invalid', 'is-valid');
        saveAccessBtn.disabled = true;
        return;
    }

    try {
        recipients.value = value;
        const parsed = JSON.parse(value);

        // Validar que sea estrictamente un objeto (diccionario), no un array ni un primitivo
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