class SecureEncryption {

    // --- MÉTODOS AUXILIARES ---
    // Convierte un ArrayBuffer a un string Hexadecimal
    static buf2hex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Convierte un string Hexadecimal a un ArrayBuffer
    static hex2buf(hexString) {
        const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
        }
        return bytes.buffer;
    }

    // Equivalente a json.dumps(sort_keys=True).
    // Garantiza que el JSON siempre se formatee igual para que la firma AAD no falle.
    static stringifySorted(obj) {
        if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
        if (Array.isArray(obj)) return `[${obj.map(SecureEncryption.stringifySorted).join(',')}]`;
        const keys = Object.keys(obj).sort();
        const mapped = keys.map(k => `"${k}":${SecureEncryption.stringifySorted(obj[k])}`);
        return `{${mapped.join(',')}}`;
    }

    // --- LÓGICA PRINCIPAL ---

    async generateKey() {
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true, // extraíble
            ["encrypt", "decrypt"]
        );
        // Retornamos los bytes crudos (ArrayBuffer) para imitar el comportamiento de Python
        return await window.crypto.subtle.exportKey("raw", key);
    }

    buildMetadata(file) {
        // En JS, usamos la propiedad .name del objeto File en lugar de os.path.basename
        const filename = file.name;
        const timestamp = new Date().toISOString(); // Equivale a datetime.now(timezone.utc).isoformat()
        return {
            algorithm_version: "AES-GCM",
            encryption_parameters: {
                key_size_bits: 256,
                nonce_size_bytes: 12,
                tag_size_bytes: 16
            },
            filename: filename,
            creation_timestamp: timestamp
        };
    }

    async encryptFile(file, rawKeyBuffer) {
        if (!(rawKeyBuffer instanceof ArrayBuffer || rawKeyBuffer instanceof Uint8Array) || rawKeyBuffer.byteLength !== 32) {
            throw new Error("La llave debe ser un ArrayBuffer/Uint8Array y tener una longitud de 256 bits (32 bytes)");
        }

        // Importar la llave cruda al formato que entiende Web Crypto
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw", rawKeyBuffer, { name: "AES-GCM" }, false, ["encrypt"]
        );

        // Leer los bytes del archivo
        const data = await file.arrayBuffer();

        // Vector de Inicialización (Nonce)
        const nonce = window.crypto.getRandomValues(new Uint8Array(12));

        // Additional Authenticated Data (Metadata)
        const metadata = this.buildMetadata(file);
        const metadataString = SecureEncryption.stringifySorted(metadata);
        const metadataBytes = new TextEncoder().encode(metadataString);

        // Algoritmo: Encriptar (Web Crypto API concatena automáticamente el tag al final)
        const encryptionBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: nonce, additionalData: metadataBytes },
            cryptoKey,
            data
        );

        // Separar CipherText y Authentication TAG para coincidir con tu contenedor de Python
        const encryptionArray = new Uint8Array(encryptionBuffer);
        const ciphertext = encryptionArray.slice(0, -16);
        const tag = encryptionArray.slice(-16);

        return {
            metadata: metadata,
            nonce: SecureEncryption.buf2hex(nonce),
            ciphertext: SecureEncryption.buf2hex(ciphertext),
            tag: SecureEncryption.buf2hex(tag)
        };
    }

    async decryptFile(container, rawKeyBuffer, customFilename = null) {
        if (!(rawKeyBuffer instanceof ArrayBuffer || rawKeyBuffer instanceof Uint8Array) || rawKeyBuffer.byteLength !== 32) {
            throw new Error("La llave debe ser de 256 bits (32 bytes).");
        }

        const cryptoKey = await window.crypto.subtle.importKey(
            "raw", rawKeyBuffer, { name: "AES-GCM" }, false, ["decrypt"]
        );

        const metadata = container.metadata;
        if (!metadata) throw new Error("El contenedor no tiene el campo metadata");

        const filename = customFilename || metadata.filename || "decrypted_file.txt";

        const nonce = SecureEncryption.hex2buf(container.nonce);
        const ciphertext = SecureEncryption.hex2buf(container.ciphertext);
        const tag = SecureEncryption.hex2buf(container.tag);

        // Reconstruir los AAD exactamente igual
        const metadataString = SecureEncryption.stringifySorted(metadata);
        const metadataBytes = new TextEncoder().encode(metadataString);

        // En Web Crypto API, para desencriptar, debemos concatenar el ciphertext y el tag
        const dataToDecrypt = new Uint8Array(ciphertext.byteLength + tag.byteLength);
        dataToDecrypt.set(new Uint8Array(ciphertext), 0);
        dataToDecrypt.set(new Uint8Array(tag), ciphertext.byteLength);

        try {
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: nonce, additionalData: metadataBytes },
                cryptoKey,
                dataToDecrypt
            );

            // Al no haber rutas del sistema, retornamos un objeto File (Blob) que el navegador puede descargar
            console.log("Archivo descifrado correctamente en memoria");
            return new File([decryptedBuffer], filename, { type: "application/octet-stream" });

        } catch (e) {
            throw new Error("Error: autenticación fallida. El archivo fue modificado o la clave es incorrecta");
        }
    }
}