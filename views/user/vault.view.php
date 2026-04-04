<?php
/*
// ---- LÓGICA PHP SIMULADA ----
if (!isset($archivos)) {
    $archivos = [
        ['id' => 1, 'nombre' => 'backup_servidor.zip.vault', 'tamano_mb' => 25.5, 'fecha' => '02/04/2024', 'tipo' => 'archive'],
        ['id' => 2, 'nombre' => 'claves_privadas.txt.vault', 'tamano_mb' => 0.012, 'fecha' => '01/04/2024', 'tipo' => 'text'],
        ['id' => 3, 'nombre' => 'identificacion.jpg.vault', 'tamano_mb' => 2.4, 'fecha' => '28/03/2024', 'tipo' => 'image']
    ];
}

$destinatarios = [
    ['id' => 101, 'username' => '@alice_smith', 'nombre' => 'Alice Smith']
];
$contactos = [
    ['id' => 102, 'username' => '@bob_jones', 'nombre' => 'Bob Jones'],
    ['id' => 103, 'username' => '@carlos_dev', 'nombre' => 'Carlos Dev']
];
*/

function formatSize(int $bytes){
    // Si es menos de 1 KB, mostrar en Bytes
    if ($bytes < 1024) {
        return $bytes . ' B';
    }

    // Convertir a KB
    $kb = $bytes / 1024;
    if ($kb < 1024) {
        return round($kb, 1) . ' KB';
    }

    // Convertir a MB
    $mb = $kb / 1024;
    if ($mb < 1024) {
        return round($mb, 1) . ' MB';
    }
}

function sizeMB(int $bytes) {
    return round(($bytes/1024/1024),1);
}

$limite_almacenamiento_mb = 10;
$espacio_usado = sizeMB(array_sum(array_column($data[0], 'tamano')));


$porcentaje_usado = min(($espacio_usado / $limite_almacenamiento_mb) * 100, 100);

foreach ($data[0] as &$archivo) {
    $archivo['destinatarios'] = json_decode($archivo['destinatarios'], true);
}
unset($archivo);


?>

<div class="vault-container">

    <div class="vault-stats">
        <div class="stat-card">
            <div class="stat-icon blue"><i class="fa-solid fa-file-shield"></i></div>
            <div class="stat-info">
                <span class="stat-label">Archivos Cifrados</span>
                <span class="stat-value"><?php echo count($data[0]); ?></span>
            </div>
        </div>

        <div class="stat-card storage-card">
            <div class="stat-icon green"><i class="fa-solid fa-database"></i></div>
            <div class="stat-info storage-info">
                <div class="storage-header">
                    <span class="stat-label">Almacenamiento (<?php echo $limite_almacenamiento_mb; ?> MB)</span>
                    <span class="stat-label percent-text"><?php echo round($porcentaje_usado, 1); ?>%</span>
                </div>
                <span class="stat-value"><?php echo round($espacio_usado, 1); ?> MB usados</span>
                <div class="progress-track">
                    <div class="progress-fill <?php echo ($porcentaje_usado > 90) ? 'danger' : ''; ?>" style="width: <?php echo $porcentaje_usado; ?>%;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="vault-actions" style="justify-content: flex-end;">
        <div class="action-buttons">
            <div class="view-toggle">
                <button id="viewList" class="toggle-btn active" title="Vista de lista"><i class="fa-solid fa-list"></i></button>
                <button id="viewGrid" class="toggle-btn" title="Vista de cuadrícula"><i class="fa-solid fa-table-cells-large"></i></button>
            </div>
            <button class="btn-upload">
                <i class="fa-solid fa-cloud-arrow-up"></i><span>Subir Archivo</span>
            </button>
        </div>
    </div>

    <div id="fileDisplay" class="file-list-view">
        <div class="file-header">
            <div class="col-name">Nombre</div><div class="col-size">Tamaño</div><div class="col-date">Fecha</div><div class="col-actions text-right">Acciones</div>
        </div>

        <div class="file-body" id="fileBody">
            <?php foreach ($data[0] as $archivo): ?>
            <div class="file-row" data-id="<?php echo htmlspecialchars($archivo['id']); ?>">
                <div class="col-name">
                    <div class="file-icon"><i class="fa-solid fa-file"></i></div>
                    <span class="file-text"><?php echo htmlspecialchars($archivo['nombre']); ?></span>
                </div>
                <div class="col-size"><?php echo formatSize($archivo['tamano']); ?></div>
                <div class="col-date"><?php echo $archivo['timestamp']; ?></div>
                <div class="col-actions">
                    <button class="action-btn share" title="Gestionar Acceso">
                        <i class="fa-solid fa-user-lock"></i>
                    </button>
                    <button class="action-btn download" title="Descargar"><i class="fa-solid fa-download"></i></button>
                    <button class="action-btn delete" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div id="uploadModal" class="modal-overlay hidden">
        <div class="modal-box">
            <div class="modal-header">
                <h3 class="modal-title">Subir nuevo archivo</h3>
                <button class="close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form action="/vault/upload" method="POST" enctype="multipart/form-data" id="uploadForm">
                <div class="modal-body">
                    <div class="file-drop-area">
                        <i class="fa-solid fa-cloud-arrow-up drop-icon"></i>
                        <span class="drop-text">Arrastra tu archivo aquí o haz clic</span>
                        <input type="file" name="archivo_boveda" id="fileInput" class="file-input" required>
                    </div>
                    <div id="filePreview" class="file-preview hidden">
                        <i class="fa-solid fa-file file-preview-icon"></i>
                        <span id="fileNameDisplay" class="file-preview-name"></span>
                    </div>

                    <div class="recipients-section">
                        <h4 class="section-title">Destinatarios Autorizados (Opcional)</h4>
                        <p class="section-desc">Selecciona quién podrá descifrar este archivo además de ti.</p>
                        <div class="contacts-list">
                            <?php foreach($data[1] as $contacto): ?>
                            <label class="contact-item">
                                <input type="checkbox" name="destinatarios" value="<?php echo $contacto['id']; ?>">
                                <div class="contact-info">
                                    <div class="contact-avatar"><?php echo substr($contacto['nombre'], 0, 1); ?></div>
                                    <div class="contact-text">
                                        <span class="contact-name"><?php echo $contacto['nombre']; ?></span>
                                        <span class="contact-user"><?php echo $contacto['usuario']; ?></span>
                                    </div>
                                </div>
                            </label>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">Cancelar</button>
                    <button type="submit" class="btn-submit"><i class="fa-solid fa-lock"></i> Cifrar y Subir</button>
                </div>
            </form>
        </div>
    </div>

    <div id="deleteModal" class="modal-overlay hidden">
        <div class="modal-box" style="max-width: 400px; text-align: center;">
            <div class="modal-body" style="padding-top: 2rem;">
                <div style="width: 60px; height: 60px; background: #fef2f2; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.25rem auto;">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 class="modal-title" style="margin-bottom: 0.5rem; justify-content: center;">¿Eliminar archivo?</h3>
                <p class="section-desc">Estás a punto de eliminar <strong id="deleteFileName" style="color: #1e293b;">archivo</strong>. Esta acción eliminará el cifrado y no se puede deshacer.</p>
            </div>
            <div class="modal-footer" style="justify-content: center; background: white; border-top: none; padding-bottom: 2rem;">
                <button type="button" class="btn-cancel">Cancelar</button>
                <form action="/vault/delete" method="POST" style="margin: 0;">
                    <input type="hidden" name="archivo_eliminar" id="deleteFileTarget">
                    <button type="submit" class="btn-submit" style="background-color: #ef4444; color: white;">
                        <i class="fa-solid fa-trash-can"></i> Sí, eliminar
                    </button>
                </form>
            </div>
        </div>
    </div>

</div>