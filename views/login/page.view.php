<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureVault - Iniciar Sesión</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <link rel="stylesheet" href="/php/css/login.css">
</head>
<body>

    <div class="login-container">
        <header class="login-header">
            <div class="vault-icon">
                <i class="fas fa-vault"></i>
            </div>
            <h1>Secure<span>Vault</span></h1>
        </header>

        <?php if (isset($loginError)): ?>
        <div class="alert-error-general">
            <i class="fas fa-exclamation-circle"></i>
            <span>Usuario o contraseña incorrectos.</span>
        </div>
        <?php endif; ?>

        <form id="loginForm" action="/php/login" method="POST">

        <input type="hidden" name="_csrf" value="<?php echo generateToken() ?>">

            <div class="input-group">
                <i class="fas fa-user input-icon"></i>
                <input type="text" id="username" name="username" placeholder="Nombre de Usuario" autocomplete="off">
                <span id="error-username" class="error-text"></span>
            </div>

            <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" id="password" name="password" placeholder="Contraseña">
                <span id="error-password" class="error-text"></span>
            </div>

            <button type="submit" class="btn-submit">
                INICIAR SESIÓN <i class="fas fa-arrow-right"></i>
            </button>

        </form>

        <div class="register-link">
            ¿No tienes cuenta? <a href="/php/signup">Solicitar credenciales</a>
        </div>

        <footer class="login-footer">
            &copy; 2026 SecureVault Project - FI UNAM
        </footer>
    </div>

    <script src="/php/js/login.js"></script>
</body>
</html>