<?php
// Datos de ejemplo actualizados con valores numéricos para calcular el almacenamiento
if (!isset($archivos)) {
    $archivos = [
        ['id' => 1, 'nombre' => 'backup_servidor.zip.vault', 'tamano_mb' => 1, 'fecha' => '02/04/2024', 'tipo' => 'archive'],
        ['id' => 2, 'nombre' => 'claves_privadas.txt.vault', 'tamano_mb' => 2, 'fecha' => '01/04/2024', 'tipo' => 'text'],
        ['id' => 3, 'nombre' => 'identificacion_oficial.jpg.vault', 'tamano_mb' => 1, 'fecha' => '28/03/2024', 'tipo' => 'image'],
        ['id' => 4, 'nombre' => 'reporte_anual_2023.pdf.vault', 'tamano_mb' => 0.5, 'fecha' => '20/03/2024', 'tipo' => 'pdf'],
    ];
}

$contactos = [
    ['id' => 101, 'username' => '@alice_smith', 'nombre' => 'Alice Smith'],
    ['id' => 102, 'username' => '@bob_jones', 'nombre' => 'Bob Jones'],
    ['id' => 103, 'username' => '@carlos_dev', 'nombre' => 'Carlos Dev'],
    ['id' => 104, 'username' => '@diana_pr', 'nombre' => 'Diana Prince']
];

// Lógica de Almacenamiento
$limite_almacenamiento_mb = 10;
$espacio_usado_mb = 0;

foreach ($archivos as $archivo) {
    $espacio_usado_mb += $archivo['tamano_mb'];
}

$porcentaje_usado = ($espacio_usado_mb / $limite_almacenamiento_mb) * 100;
// Asegurarnos de que no pase del 100% visualmente
$porcentaje_visual = min($porcentaje_usado, 100);

// Función para asignar iconos según el tipo
function getIcon($tipo) {
    switch($tipo) {
        case 'archive': return 'fa-file-zipper';
        case 'image': return 'fa-file-image';
        case 'pdf': return 'fa-file-pdf';
        case 'text': return 'fa-file-lines';
        default: return 'fa-file';
    }
}

// Función para formatear el texto del tamaño en la tabla
function formatSizeText($mb) {
    if ($mb < 1) {
        return round($mb * 1024) . ' KB';
    }
    return round($mb, 1) . ' MB';
}
?>

<div class="vault-container">
    <div class="vault-stats">

        <div class="stat-card">
            <div class="stat-icon blue"><i class="fa-solid fa-file-shield"></i></div>
            <div class="stat-info">
                <span class="stat-label">Archivos Cifrados</span>
                <span class="stat-value"><?php echo count($archivos); ?></span>
            </div>
        </div>

        <div class="stat-card storage-card">
            <div class="stat-icon green"><i class="fa-solid fa-database"></i></div>
            <div class="stat-info storage-info">
                <div class="storage-header">
                    <span class="stat-label">Almacenamiento (<?php echo $limite_almacenamiento_mb; ?> MB)</span>
                    <span class="stat-label percent-text"><?php echo round($porcentaje_usado, 1); ?>%</span>
                </div>
                <span class="stat-value"><?php echo round($espacio_usado_mb, 1); ?> MB usados</span>

                <div class="progress-track">
                    <div class="progress-fill <?php echo ($porcentaje_visual > 90) ? 'danger' : ''; ?>"
                         style="width: <?php echo $porcentaje_visual; ?>%;"></div>
                </div>
            </div>
        </div>

    </div>

    <div class="vault-actions">
        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="vaultSearch" placeholder="Buscar en la bóveda...">
        </div>

        <div class="action-buttons">
            <div class="view-toggle">
                <button id="viewList" class="toggle-btn active" title="Vista de lista">
                    <i class="fa-solid fa-list"></i>
                </button>
                <button id="viewGrid" class="toggle-btn" title="Vista de cuadrícula">
                    <i class="fa-solid fa-table-cells-large"></i>
                </button>
            </div>
            <button class="btn-upload">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span>Subir Archivo</span>
            </button>
        </div>
    </div>

    <div id="fileDisplay" class="file-list-view">
        <div class="file-header">
            <div class="col-name">Nombre</div>
            <div class="col-size">Tamaño</div>
            <div class="col-date">Fecha</div>
            <div class="col-actions text-right">Acciones</div>
        </div>

        <div class="file-body" id="fileBody">
            <?php foreach ($archivos as $archivo): ?>
            <div class="file-row" data-name="<?php echo strtolower($archivo['nombre']); ?>">
                <div class="col-name">
                    <div class="file-icon">
                        <i class="fa-solid <?php echo getIcon($archivo['tipo']); ?>"></i>
                    </div>
                    <span class="file-text"><?php echo htmlspecialchars($archivo['nombre']); ?></span>
                </div>
                <div class="col-size"><?php echo formatSizeText($archivo['tamano_mb']); ?></div>
                <div class="col-date"><?php echo $archivo['fecha']; ?></div>
                <div class="col-actions">
                    <button class="action-btn download" title="Descargar y descifrar">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <button class="action-btn delete" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
