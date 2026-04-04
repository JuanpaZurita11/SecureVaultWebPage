// register.js - JS Vanilla para SecureVault

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const userInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    registerForm.addEventListener('submit', async (e) => {
        // 1. Prevenir el envío automático (esto es clave para CSE)
        e.preventDefault();

        // 2. Recuperar valores limpios
        const email = emailInput.value;
        const username = userInput.value;
        const plainPassword = passwordInput.value;

        // --- INICIO DE LA LÓGICA DE SECUREVAULT ---
        // Aquí es donde, en el futuro, derivaremos las claves
        // y cifraremos los metadatos del usuario antes de enviarlos.

        console.log("Formulario interceptado.");
        console.log(`Usuario: ${username}, Correo: ${email}`);
        console.warn("¡OJO! La contraseña sigue en plano. Falta implementar el cifrado del lado del cliente antes del envío.");

        /*
           Ejemplo de flujo futuro (CSE):
           1. Derivar una llave AES de 'plainPassword' (usando PBKDF2).
           2. Cifrar 'username' y 'email' con esa llave.
           3. Generar una clave pública/privada (RSA) para compartir archivos.
           4. Enviar datos CIFRADOS al servidor PHP.
        */

        // Por ahora, simulamos un envío directo para validar que funciona el HTML.
        // Solo habilitar para pruebas, NUNCA enviar la clave maestra en plano.
        // this.submit();
    });
});