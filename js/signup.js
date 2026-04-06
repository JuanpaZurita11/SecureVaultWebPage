import { KeyManger } from "./Crypto/Symmetric_Crypto.js";

const registerForm = document.getElementById('registerForm');

// Función para mostrar error en un campo específico
const showError = (inputId, message) => {
    const input = document.getElementById(inputId);
    const errorContainer = input.nextElementSibling; // El div.error-message

    input.classList.add('error');
    errorContainer.innerText = message;
};

// Función para limpiar todos los errores
const clearErrors = () => {
    const inputs = registerForm.querySelectorAll('input');
    const messages = registerForm.querySelectorAll('.error-message');

    inputs.forEach(input => input.classList.remove('error'));
    messages.forEach(msg => msg.innerText = '');
};

const keyManger = new KeyManger();

registerForm.addEventListener('submit', async (e) => {

    e.preventDefault();
    clearErrors();

    let hasErrors = false;

    // 1. Capturar valores
    const email = document.getElementById('email').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const password = document.getElementById('password').value;
    const publicKeySelector = document.getElementById('public_key');
    const privateKeySelector = document.getElementById('private_key');

    // 2. Validaciones campo por campo
    if (!email) {
        showError('email', 'El correo es obligatorio');
        hasErrors = true;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Formato de correo inválido');
            hasErrors = true;
        }
    }

    if (!nombre) {
        showError('nombre', 'El nombre es obligatorio');
        hasErrors = true;
    }

    if (!apellido) {
        showError('apellido', 'El apellido es obligatorio');
        hasErrors = true;
    }

    if (!password) {
        showError('password', 'La contraseña es obligatoria');
        hasErrors = true;
    } else if (password.length < 6) {
        showError('password', 'Mínimo 6 caracteres');
        hasErrors = true;
    }



    // 3. Envío si todo está bien
    if (!hasErrors) {
        const {publicKey, privateKey } = await keyManger.generate_key_pair();

        publicKeySelector.value = publicKey;
        privateKeySelector.value = privateKey;

        registerForm.submit(); // Descomenta para enviar realmente
    }
});

