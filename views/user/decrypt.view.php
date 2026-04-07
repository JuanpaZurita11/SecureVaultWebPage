<div class="share-vertical-form">
    <h2 class="text-2xl font-bold">Descifrar Documento</h2>
    <p class="section-desc">Sube el archivo cifrado y su archivo de metadatos correspondiente para recuperar el contenido original.</p>

    <div class="upload-section-compact">
        <h3 class="table-title">1. Archivo de Metadatos (.json)</h3>
        <label for="metadata-upload" class="file-drop-compact" id="drop-metadata">
            <div class="upload-compact-content">
                <i class="fa-solid fa-file-code upload-icon-small"></i>
                <div class="upload-text-group">
                    <span class="upload-text">Seleccionar metadata.json</span>
                    <span class="upload-hint">Contiene las llaves y el nonce</span>
                </div>
            </div>
            <input type="file" id="metadata-upload" accept=".json" class="file-input" required />
        </label>
        <div id="metadata-message" class="file-message"></div>
    </div>

    <div class="upload-section-compact">
        <h3 class="table-title">2. Archivo Cifrado (.enc)</h3>
        <label for="file-upload" class="file-drop-compact" id="drop-file">
            <div class="upload-compact-content">
                <i class="fa-solid fa-file-shield upload-icon-small" style="color: #f59e0b;"></i>
                <div class="upload-text-group">
                    <span class="upload-text">Seleccionar archivo cifrado</span>
                    <span class="upload-hint">El archivo con extensión .enc</span>
                </div>
            </div>
            <input type="file" id="file-upload" accept=".enc" class="file-input" required />
        </label>
        <div id="file-message" class="file-message"></div>
    </div>

    <div class="submit-container">
        <button type="button" id="btn-decrypt" class="btn-send" disabled>
            <i class="fa-solid fa-unlock"></i> Descifrar y Descargar
        </button>
    </div>

    <div id="username" data-username="<?php echo $_SESSION['username']?>" data-privatekey="<?php echo $privateKey?>"></div>
</div>