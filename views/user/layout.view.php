<?php

    $extra_CSS ??= [];
    $extra_JS  ??= [];

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $titulo_pagina ?? 'SecureVault'; ?></title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link rel="stylesheet" href="/php/css/user/layout.css">
    <?php foreach ($extra_CSS as $sheet): ?>
    <link rel="stylesheet" href="/php/css/user/<?= htmlspecialchars($sheet) ?>.css">
    <?php endforeach; ?>
</head>
<body>

    <div class="app-container">

        <div id="sidebarOverlay" class="sidebar-overlay"></div>

        <aside id="sidebar" class="sidebar">

            <div class="sidebar-header">
                <i class="fa-solid fa-shield-halved"></i>
                <span>SecureVault</span>
            </div>

            <nav class="sidebar-nav">
                <p class="nav-title">Menú Principal</p>

                <a href="/vault" class="nav-link active">
                    <i class="fa-solid fa-hard-drive"></i>
                    <span>Mi Bóveda</span>
                </a>

                <a href="/search-vaults" class="nav-link">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Buscar Bóvedas</span>
                </a>

                <a href="/contacts" class="nav-link">
                    <i class="fa-solid fa-users"></i>
                    <span>Contactos</span>
                </a>

                <a href="/profile" class="nav-link">
                    <i class="fa-solid fa-gear"></i>
                    <span>Configuración</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <a href="/logout" class="nav-link logout-link">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Cerrar sesión</span>
                </a>
            </div>
        </aside>

        <div class="main-wrapper">

            <header class="topbar">
                <div class="topbar-left">
                    <button id="mobileMenuBtn" class="mobile-menu-btn">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <h1 class="page-title">
                        <?php echo $titulo_pagina ?? 'Dashboard'; ?>
                    </h1>
                </div>

                <div class="topbar-right">
                    <div class="user-profile">
                        <span class="user-name">
                            <?php echo 'Hola, ' . ($usuario_nombre ?? 'Usuario'); ?>
                        </span>
                    </div>
                </div>
            </header>

            <main class="content-area">
                <?php echo $contents; ?>
            </main>

        </div>
    </div>

    <script src="/php/js/user/layout.js"></script>
    <?php foreach ($extra_JS as $script): ?>
    <script src="/php/js/user/<?= htmlspecialchars($script) ?>.js"></script>
    <?php endforeach; ?>
</body>
</html>