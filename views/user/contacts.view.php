<?php
// Datos simulados
if (!isset($contactos)) {
    $contactos = [
        ['id' => 101, 'username' => '@alice_smith', 'nombre' => 'Alice Smith'],
        ['id' => 102, 'username' => '@bob_jones', 'nombre' => 'Bob Jones'],
        ['id' => 103, 'username' => '@carlos_dev', 'nombre' => 'Carlos Dev'],
        ['id' => 104, 'username' => '@diana_pr', 'nombre' => 'Diana Prince']
    ];
}

// Función para obtener iniciales
function getInitials($name) {
    $words = explode(" ", $name);
    $initials = "";
    foreach ($words as $w) {
        $initials .= $w[0];
    }
    return strtoupper(substr($initials, 0, 2));
}
?>

<div class="contacts-container">

    <div class="contacts-header-section">
        <div>
            <h2 class="text-2xl font-bold" style="color: var(--text-main); margin-bottom: 0.25rem;">Mis Contactos</h2>
            <p style="color: var(--text-muted); font-size: 0.875rem;">Llaves públicas conocidas.</p>
        </div>
        <div class="header-stats">
            <div class="stat-badge">
                <i class="fa-solid fa-users text-blue"></i>
                <span><?php echo count($contactos); ?> Contactos</span>
            </div>
        </div>
    </div>

    <div class="contacts-actions" style="justify-content: flex-end;">
        <div class="action-buttons">
            <button class="btn-add-contact" id="btnAñadirContacto">
                <i class="fa-solid fa-user-plus"></i><span>Añadir Contacto</span>
            </button>
        </div>
    </div>

    <div class="contacts-list-view">
        <div class="contacts-header">
            <div class="col-user">Usuario</div>
            <div class="col-actions text-right">Acciones</div>
        </div>

        <div class="contacts-body" id="contactsBody">
            <?php if(empty($contactos)): ?>
                <div class="empty-state">
                    <i class="fa-solid fa-address-book" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem; display: block;"></i>
                    <p>Aún no tienes contactos</p>
                    <span>Añade a alguien para empezar a compartir archivos.</span>
                </div>
            <?php else: ?>
                <?php foreach ($contactos as $contacto): ?>
                <div class="contact-row" data-name="<?php echo strtolower($contacto['nombre'] . ' ' . $contacto['username']); ?>">
                    <div class="col-user">
                        <div class="user-avatar-large">
                            <?php echo getInitials($contacto['nombre']); ?>
                        </div>
                        <div class="user-details">
                            <span class="user-fullname"><?php echo htmlspecialchars($contacto['nombre']); ?></span>
                            <span class="user-handle"><?php echo htmlspecialchars($contacto['username']); ?></span>
                        </div>
                    </div>

                    <div class="col-actions">
                        <a href="/public-vault?user=<?php echo urlencode($contacto['username']); ?>" class="action-btn view" title="Ver Bóveda Pública">
                            <i class="fa-solid fa-folder-open"></i>
                        </a>
                        <button class="action-btn delete btn-delete-contact" title="Eliminar Contacto" data-username="<?php echo htmlspecialchars($contacto['username']); ?>">
                            <i class="fa-solid fa-user-minus"></i>
                        </button>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <div id="deleteContactModal" class="modal-overlay hidden">
        <div class="modal-box" style="max-width: 400px; text-align: center;">
            <div class="modal-body" style="padding-top: 2rem;">
                <div style="width: 60px; height: 60px; background: #fef2f2; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.25rem auto;">
                    <i class="fa-solid fa-user-xmark"></i>
                </div>
                <h3 class="modal-title" style="margin-bottom: 0.5rem; justify-content: center;">¿Eliminar contacto?</h3>
                <p class="section-desc">Estás a punto de eliminar a <strong id="deleteContactName" style="color: #1e293b;">@usuario</strong> de tus contactos.</p>
            </div>
            <div class="modal-footer" style="justify-content: center; background: white; border-top: none; padding-bottom: 2rem;">
                <button type="button" class="btn-cancel">Cancelar</button>
                <form action="/contacts/delete" method="POST" style="margin: 0;">
                    <input type="hidden" name="contacto_username" id="deleteContactTarget">
                    <button type="submit" class="btn-submit delete-style">
                        <i class="fa-solid fa-trash-can"></i> Sí, eliminar
                    </button>
                </form>
            </div>
        </div>
    </div>

    <div id="addContactModal" class="modal-overlay hidden">
        <div class="modal-box">
            <div class="modal-header">
                <h3 class="modal-title">Añadir Nuevo Contacto</h3>
                <button class="close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form action="/contacts/add" method="POST">
                <div class="modal-body">
                    <p class="section-desc mb-4">Ingresa el nombre de usuario exacto de la persona que deseas agregar a tu red segura.</p>
                    <div class="search-box" style="width: 100%;">
                        <i class="fa-solid fa-at"></i>
                        <input type="text" name="nuevo_usuario" placeholder="ejemplo_usuario" required style="width: 100%; border: 1px solid #e2e8f0;">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">Cancelar</button>
                    <button type="submit" class="btn-submit"><i class="fa-solid fa-user-plus"></i> Añadir</button>
                </div>
            </form>
        </div>
    </div>

</div>