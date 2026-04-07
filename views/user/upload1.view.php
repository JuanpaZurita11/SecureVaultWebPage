<form action="/php/upload/recipients" method="POST" class="share-vertical-form">
    <input type="hidden" name="_csrf" value="<?php echo generateToken() ?>">

    <div class="contacts-table-section">
        <h3 class="table-title">Paso 1: Selecciona los contactos a compartir (Opcional)</h3>

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
        <button type="submit" class="btn-send">
            Continuar <i class="fa-solid fa-arrow-right"></i>
        </button>
    </div>
</form>