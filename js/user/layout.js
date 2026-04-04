document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL SIDEBAR (MÓVIL) ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {

        // Función para abrir/cerrar el menú
        const toggleMenu = () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
        };

        // Abrir menú al tocar el botón de hamburguesa
        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Cerrar menú al tocar el fondo oscuro
        sidebarOverlay.addEventListener('click', toggleMenu);
    }
});