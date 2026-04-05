<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Usuario - SecureVault 2026 - FI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/php/css/signup.css">
</head>
<body>

    <div class="login-container">
        <div class="header-logo">
            <div class="logo-icon">
                <i class="fas fa-key"></i>
            </div>
            <h1>Secure<span>Vault</span></h1>
            <p>Criptografía 2026 - FI</p>
        </div>

        <form id="registerForm" action="/signup/register" method="POST" novalidate>
            <div class="input-group">
                <i class="fas fa-envelope icon"></i>
                <input type="email" id="email" name="email" placeholder="Correo Electrónico">
                <div class="error-message"></div>
            </div>

            <div class="input-group">
                <i class="fas fa-user icon"></i>
                <input type="text" id="nombre" name="nombre" placeholder="Nombre">
                <div class="error-message"></div>
            </div>

            <div class="input-group">
                <i class="fas fa-users icon"></i>
                <input type="text" id="apellido" name="apellido" placeholder="Apellido">
                <div class="error-message"></div>
            </div>

            <div class="input-group">
                <i class="fas fa-lock icon"></i>
                <input type="password" id="password" name="password" placeholder="Contraseña para la cuenta">
                <div class="error-message"></div>
            </div>

            <button type="submit" id="btnRegister">
                CREAR CUENTA <i class="fas fa-user-plus"></i>
            </button>
        </form>

        <div class="sign-up-link">
            YA TENGO CUENTA. <a href="/php/login">LOG IN</a>
        </div>
    </div>

    <script src="/php/js/signup.js"></script>

</body>
</html>