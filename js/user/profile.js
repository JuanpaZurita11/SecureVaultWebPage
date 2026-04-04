document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA PARA VER/OCULTAR CONTRASEÑA
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const icon = togglePasswordBtn.querySelector('i');

            // Alternar el tipo de input entre 'password' y 'text'
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    // 2. LÓGICA PARA HABILITAR/DESHABILITAR EL BOTÓN DE GUARDAR
    const profileForm = document.getElementById('profileForm');
    const saveBtn = document.getElementById('saveBtn');

    if (profileForm && saveBtn) {
        // Almacenamos el estado inicial de los datos del formulario al cargar la página
        const initialData = new FormData(profileForm);

        // Función que revisa si hubo cambios
        const checkFormChanges = () => {
            let hasChanged = false;
            const currentData = new FormData(profileForm);

            // Comparamos el valor actual de cada input con su valor inicial
            for (let [key, value] of currentData.entries()) {
                if (initialData.get(key) !== value) {
                    hasChanged = true;
                    break; // Si encontramos al menos un cambio, dejamos de buscar
                }
            }

            // Habilitamos o deshabilitamos el botón según el resultado
            saveBtn.disabled = !hasChanged;
        };

        // Escuchamos el evento 'input' (que se dispara en tiempo real cada vez que escribes)
        profileForm.addEventListener('input', checkFormChanges);
    }
});