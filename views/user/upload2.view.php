<div class="share-header">
    <a href="/php/upload" class="btn-back-prominent">
        <i class="fa-solid fa-arrow-left"></i> Regresar a contactos
    </a>
</div>

<div class="share-vertical-form">

    <div class="upload-section-compact">
        <h3 class="table-title">Paso 2: Sube tu documento</h3>
        <label for="file-upload" class="file-drop-compact">
            <div class="upload-compact-content">
                <i class="fa-solid fa-cloud-arrow-up upload-icon-small"></i>
                <div class="upload-text-group">
                    <span class="upload-text">Haz clic para seleccionar un archivo</span>
                    <span class="upload-hint">Peso máximo permitido: 1 MB</span>
                </div>
            </div>
            <input type="file" id="file-upload" class="file-input" required />
        </label>
        <div id="file-message" class="file-message"></div>
    </div>

    <form action="/php/upload/now" method="POST" enctype="multipart/form-data" id="formArchivo">
        <input type="hidden" name="_csrf" value="<?php echo generateToken() ?>">
        <input type="hidden" name="metadata" id="metadata" value="">

        <input type="file" name="archivo" id="encryptedFile" style="display:none;">

        <div class="submit-container">
            <button type="submit" id="btn-send" class="btn-send" disabled>
                <i class="fa-solid fa-paper-plane"></i> Enviar Archivo
            </button>
        </div>
    </form>

</div> <script type="application/json" id="datos-contactos">
    <?php echo json_encode($data); ?>
</script>