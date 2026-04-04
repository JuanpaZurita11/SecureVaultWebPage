<?php
// --- SIMULACIÓN DE LÓGICA DE CONTROLADOR ---
$busqueda = '@alice_smith';
$usuario_encontrado = false;
$perfil_publico = null;
$archivos_publicos = [];

// Simulamos que encontramos a alguien si buscan exactamente "@alice_smith"
if ($busqueda === '@alice_smith') {
    $usuario_encontrado = true;
    $perfil_publico = [
        'nombre' => 'Alice Smith',
        'username' => '@alice_smith',
        'email' => 'alice.smith@ejemplo.com'
    ];
    $archivos_publicos = [
        ['nombre' => 'proyecto_compartido.zip.vault', 'tamano_mb' => 45.2, 'fecha' => '10/04/2024'],
        ['nombre' => 'manual_usuario.pdf.vault', 'tamano_mb' => 2.1, 'fecha' => '05/04/2024'],
        ['nombre' => 'logo_empresa.png.vault', 'tamano_mb' => 1.5, 'fecha' => '01/04/2024']
    ];
}

function formatSize($mb) { return $mb < 1 ? round($mb * 1024) . ' KB' : round($mb, 1) . ' MB'; }
?>

<div class="search-vault-container">

    <div class="search-header-section">
        <h2 class="text-2xl font-bold" style="color: var(--text-main); margin-bottom: 0.5rem;">Explorador de Bóvedas</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">Busca a otros usuarios por su @username para sus bóvedas seguras.</p>

        <form action="/search-vaults" method="GET" class="main-search-form">
            <div class="main-search">
                <input type="text" name="username" placeholder="Ejemplo: @alice_smith" value="<?php echo htmlspecialchars($busqueda); ?>" required autocomplete="off">
                <button type="submit" class="btn-search">Buscar</button>
            </div>
        </form>
    </div>

    <?php if ($busqueda !== '' && !$usuario_encontrado): ?>

        <div class="empty-state">
            <p>Usuario no encontrado</p>
            <span>No existe ninguna bóveda asociada al usuario "<strong><?php echo htmlspecialchars($busqueda); ?></strong>".</span>
        </div>

    <?php elseif ($usuario_encontrado && $perfil_publico): ?>

        <div class="public-profile-card">
            <div class="profile-info-basic">
                <div>
                    <h3 class="profile-name"><?php echo htmlspecialchars($perfil_publico['nombre']); ?></h3>
                    <span class="profile-username"><?php echo htmlspecialchars($perfil_publico['username']); ?></span>
                </div>
            </div>

            <div class="profile-contact">
                <p class="contact-hint">Solicita Acceso</p>
                <span class="highlight-email">
                    <i class="fa-regular fa-envelope"></i> <?php echo htmlspecialchars($perfil_publico['email']); ?>
                </span>
            </div>
        </div>

        <div class="vault-actions" style="margin-top: 1rem; margin-bottom: 1rem;">
            <h4 style="font-weight: 600; color: #1e293b;">Archivos en Bóveda (<?php echo count($archivos_publicos); ?>)</h4>
        </div>

        <div class="file-list-view">
            <div class="file-header">
                <div class="col-name">Nombre</div>
                <div class="col-size">Tamaño</div>
                <div class="col-date">Fecha</div>
                <div class="col-actions text-right">Acción</div>
            </div>

            <div class="file-body" id="publicFileBody">
                <?php if(empty($archivos_publicos)): ?>
                    <div style="padding: 2rem; text-align: center; color: #94a3b8;">
                        Esta bóveda está vacía.
                    </div>
                <?php else: ?>
                    <?php foreach ($archivos_publicos as $archivo): ?>
                    <div class="file-row" data-name="<?php echo strtolower($archivo['nombre']); ?>">
                        <div class="col-name">
                            <span class="file-text"><?php echo htmlspecialchars($archivo['nombre']); ?></span>
                        </div>
                        <div class="col-size"><?php echo formatSize($archivo['tamano_mb']); ?></div>
                        <div class="col-date"><?php echo $archivo['fecha']; ?></div>
                        <div class="col-actions">
                            <button class="action-btn download" title="Descargar archivo cifrado">
                                <i class="fa-solid fa-download"></i>
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

    <?php else: ?>

        <div class="empty-state" style="opacity: 0.6;">
            <p>Red Segura</p>
            <span>Ingresa un nombre de usuario arriba para explorar.</span>
        </div>

    <?php endif; ?>

</div>