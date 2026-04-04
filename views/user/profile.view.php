<?php
// --- SIMULACIÓN DE DATOS DEL PERFIL ---
if (!isset($perfil)) {
    $perfil = [
        'nombre' => 'Alice',
        'apellido' => 'Smith',
        'email' => 'alice.smith@ejemplo.com',
        'password' => 'ClaveSecreta123!',
        'llave_publica' => "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzqX...\n-----END PUBLIC KEY-----",
        'llave_privada' => "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoI...\n-----END PRIVATE KEY-----"
    ];
}
?>

<div class="profile-container">

    <div class="profile-header-section">
        <h2 class="text-2xl font-bold" style="color: var(--text-main); margin-bottom: 0.25rem;">Configuración de Perfil</h2>
        <p class="section-desc">Actualiza tu información personal y visualiza tus llaves criptográficas.</p>
    </div>

    <div class="profile-grid">

        <div class="profile-column">
            <div class="profile-card">
                <h3 class="card-title"><i class="fa-solid fa-user-pen text-blue"></i> Editar Información</h3>

                <form action="/profile/update" method="POST" id="profileForm">
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="nombre">Nombre</label>
                            <input type="text" id="nombre" name="nombre" value="<?php echo htmlspecialchars($perfil['nombre']); ?>" required>
                        </div>
                        <div class="form-group half">
                            <label for="apellido">Apellido</label>
                            <input type="text" id="apellido" name="apellido" value="<?php echo htmlspecialchars($perfil['apellido']); ?>" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($perfil['email']); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <div class="input-with-icon">
                            <input type="password" id="password" name="password" value="<?php echo htmlspecialchars($perfil['password']); ?>" required>
                            <button type="button" id="togglePasswordBtn" class="btn-inside" title="Mostrar/Ocultar">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div class="form-actions" style="margin-top: 2rem;">
                        <button type="submit" id="saveBtn" class="btn-submit" disabled>Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="profile-column">
            <div class="profile-card keys-card">
                <h3 class="card-title"><i class="fa-solid fa-shield-halved text-blue"></i> Mis Llaves Criptográficas</h3>
                <p class="section-desc">Estas llaves son exclusivas de tu cuenta. Nunca compartas tu llave privada con nadie.</p>

                <div class="key-group">
                    <div class="key-header public-header">
                        <div class="key-title">
                            <i class="fa-solid fa-earth-americas"></i>
                            <span>Llave Pública</span>
                        </div>
                    </div>
                    <textarea readonly class="key-display"><?php echo htmlspecialchars($perfil['llave_publica']); ?></textarea>
                    <p class="key-hint">Esta llave se comparte automáticamente con tus contactos.</p>
                </div>

                <div class="key-group" style="margin-top: 1.5rem;">
                    <div class="key-header private-header">
                        <div class="key-title">
                            <i class="fa-solid fa-key"></i>
                            <span>Llave Privada</span>
                        </div>
                    </div>
                    <textarea readonly class="key-display private-display"><?php echo htmlspecialchars($perfil['llave_privada']); ?></textarea>
                    <p class="key-hint text-danger-hint">Mantenla estrictamente confidencial.</p>
                </div>

            </div>
        </div>

    </div>
</div>