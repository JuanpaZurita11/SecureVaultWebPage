<?php

function formatSize($bytes) {
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
?>

<div class="search-vault-container">
    <div class="search-header-section">
        <h2 class="text-2xl font-bold" style="color: var(--text-main); margin-bottom: 0.5rem;">Explorador de Bóvedas</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">Busca a otros usuarios por su @username</p>

        <form action="/php/dashboard/search_vaults" method="GET" class="main-search-form">
            <div class="main-search">
                <input type="text" name="username" placeholder="Ejemplo: alice_smith" required autocomplete="off">
                <button type="submit" class="btn-search">Buscar</button>
            </div>
        </form>
    </div>

    <?php if(!isset($data)): ?>
        <div class="empty-state" style="opacity: 0.6;">
            <p>No se ha realizado ninguna búsqueda</p>
        </div>
    <?php elseif(empty($data)): ?>
        <div class="empty-state">
            <p>Usuario no encontrado</p>
        </div>
    <?php else: ?>
        <div class="public-profile-card">
            <div class="profile-info-basic">
                <div>
                    <h3 class="profile-name"><?php echo htmlspecialchars("{$data[0]['nombre']} {$data[0]["apellido"]}"); ?></h3>
                    <span class="profile-username"><?php echo htmlspecialchars("@{$data[0]['usuario']}"); ?></span>

                    <div style="margin-top: 0.75rem;">
                        <?php if (empty($data[2])): ?>
                            <button class="btn-contact-action add" data-action="add">
                                <i class="fa-solid fa-user-plus"></i> Añadir contacto
                            </button>
                        <?php else: ?>
                            <button class="btn-contact-action delete" data-action="del">
                                <i class="fa-solid fa-user-minus"></i> Eliminar contacto
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <div class="profile-contact">
                <p class="contact-hint">Solicita Acceso</p>
                <span class="highlight-email">
                    <i class="fa-regular fa-envelope"></i> <?php echo htmlspecialchars($data[0]['correo']); ?>
                </span>
            </div>
        </div>

        <div class="vault-actions" style="margin-top: 1rem; margin-bottom: 1rem;">
            <h4 style="font-weight: 600; color: #1e293b;">Archivos en Bóveda (<?php echo count($data[1]); ?>)</h4>
        </div>

        <div class="file-list-view">
            <div class="file-header">
                <div class="col-name">Nombre</div>
                <div class="col-size">Tamaño</div>
                <div class="col-date">Fecha</div>
                <div class="col-actions text-right">Acción</div>
            </div>

            <div class="file-body" id="publicFileBody">
                <?php foreach ($data[1] as $archivo): ?>
                <div class="file-row" data-name="<?php echo strtolower($archivo['nombre']); ?>">
                    <div class="col-name">
                        <span class="file-text"><?php echo htmlspecialchars($archivo['nombre']); ?></span>
                    </div>
                    <div class="col-size"><?php echo formatSize($archivo['tamano']); ?></div>
                    <div class="col-date"><?php echo $archivo['timestamp']; ?></div>
                    <div class="col-actions">
                        <button class="action-btn download" title="Descargar archivo cifrado">
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
</div>

<div id="modalConfirmacion" class="modal-overlay hidden">
    <div class="modal-box">
        <div class="modal-header">
            <h3 class="modal-title" id="modalTitle">Confirmar acción</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p id="modalMessage" style="color: var(--text-muted); line-height: 1.5;"></p>
        </div>
        <div class="modal-footer">
            <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
            <form action="/php/dashboard/search_vaults/updateRelation" method="POST">
                <input type="hidden" name="_csrf" value="<?php echo generateToken() ?>">
                <input type="hidden" name="action">
                <input type="hidden" name="contacto_id" value="<?php echo $data[2] ?>">
                <input type="hidden" name="usuario_id" value="<?php echo $data[3] ?>">
                <button type='submit' id="btnConfirmAction" class="btn-submit">Confirmar</button>
            </form>
        </div>
    </div>
</div>