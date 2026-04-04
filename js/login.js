document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const errorUsername = document.getElementById('error-username');
    const errorPassword = document.getElementById('error-password');

    // Limpiar el error general del servidor cuando el usuario empiece a escribir
    const generalError = document.querySelector('.alert-error-general');

    if (generalError) {
        const inputs = [usernameInput, passwordInput];
        inputs.forEach(input => {
        input.addEventListener('input', () => {
            generalError.style.display = 'none';
        });
    });
}

    // Función para mostrar error
    function showError(input, span, message) {
        input.classList.add('input-error');
        span.innerText = message;
    }

    // Función para limpiar error
    function clearError(input, span) {
        input.classList.remove('input-error');
        span.innerText = "";
    }

    // Validación en tiempo real (al escribir)
    usernameInput.addEventListener('input', function() {
        if (this.value.length >= 0) {
            clearError(usernameInput, errorUsername);
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length >= 0) {
            clearError(usernameInput, errorUsername);
        }
    });

    // Validación al intentar enviar el formulario
    loginForm.addEventListener('submit', function(evento) {
        let esValido = true;

        // Limpiar errores previos
        clearError(usernameInput, errorUsername);
        clearError(passwordInput, errorPassword);

        // 1. Validar Usuario
        if (usernameInput.value.trim() === "") {
            showError(usernameInput, errorUsername, "El usuario es obligatorio.");
            esValido = false;
        }

        // 2. Validar Contraseña
        if (passwordInput.value.trim() === "") {
            showError(passwordInput, errorPassword, "La contraseña es obligatoria.");
            esValido = false;
        }

        // 3. Decidir si enviar o detener
        if (!esValido) {
            evento.preventDefault();
            console.log("Validación de JS fallida. Corrija los campos.");
        } else {
            console.log("Validación de JS exitosa. Enviando datos a PHP...");
        }
    });
});