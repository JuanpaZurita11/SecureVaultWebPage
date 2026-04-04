document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('vaultSearch');
    const fileRows = document.querySelectorAll('.file-row');
    const btnList = document.getElementById('viewList');
    const btnGrid = document.getElementById('viewGrid');
    const fileDisplay = document.getElementById('fileDisplay');

    // 1. Lógica de Búsqueda
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        fileRows.forEach(row => {
            const name = row.getAttribute('data-name');
            row.style.display = name.includes(term) ? '' : 'none';
        });
    });

    // 2. Cambio de Vista
    btnGrid.addEventListener('click', () => {
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        fileDisplay.className = 'file-grid-view';
    });

    btnList.addEventListener('click', () => {
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
        fileDisplay.className = 'file-list-view';
    });
});