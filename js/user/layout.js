document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL SIDEBAR (VERSIÓN MÓVIL) ---
    // Este código debe vivir aquí porque el menú lateral aparece en TODAS las páginas
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        const toggleMenu = () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
        };

        // Abrir menú al tocar el botón
        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Cerrar menú al tocar el fondo oscuro
        sidebarOverlay.addEventListener('click', toggleMenu);
    }

});