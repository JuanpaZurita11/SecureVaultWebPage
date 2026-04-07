<?php
// Simulación de los datos (Reemplazarás esto con tu consulta a la BD)
?>

<div class="share-header">
    <a href="/php/dashboard" class="btn-back-prominent">
        <i class="fa-solid fa-arrow-left"></i> Regresar
    </a>
</div>

<form action="/php/dashboard/upload/now" method="POST" enctype="multipart/form-data" class="share-vertical-form">
  <input type="hidden" name="_csrf" value="<?php echo generateToken() ?>">

    <div class="upload-section-compact">
        <label for="file-upload" class="file-drop-compact">
            <div class="upload-compact-content">
                <i class="fa-solid fa-cloud-arrow-up upload-icon-small"></i>
                <div class="upload-text-group">
                    <span class="upload-text">Haz clic para seleccionar un archivo</span>
                    <span class="upload-hint">Peso máximo permitido: 5 MB</span>
                </div>
            </div>
            <input type="file" id="file-upload" name="archivo" class="file-input" required />
        </label>
        <div id="file-message" class="file-message"></div>
    </div>

    <div class="contacts-table-section">
        <h3 class="table-title">Selecciona los contactos a compartir (Opcional):</h3>

        <div class="table-scroll-container">
            <table class="contacts-table">
                <thead>
                    <tr>
                        <th class="col-checkbox"></th>
                        <th class="col-name">Nombre del contacto</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if (!empty($data)) {
                        echo "<input type='hidden' name='contactos_seleccionados[]' value='{$_SESSION['userId']}'>";
                        foreach ($data as $contacto) {
                            $username = htmlspecialchars($contacto['usuario']);
                            echo "
                            <tr class='contact-row'>
                                <td class='col-checkbox'>
                                    <input type='checkbox' name='contactos_seleccionados[]' value='{$contacto['id']}'>
                                </td>
                                <td class='col-name'>
                                    <label>@{$username}</label>
                                </td>
                            </tr>";
                        }
                    } else {
                        echo '<tr><td colspan="2" class="empty-state">No tienes contactos disponibles.</td></tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="submit-container">
        <button type="submit" id="btn-send" class="btn-send" disabled>
            <i class="fa-solid fa-paper-plane"></i> Enviar Archivo
        </button>
    </div>
</form>