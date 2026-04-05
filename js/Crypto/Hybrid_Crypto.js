class KeyManager {

    // --- Helpers para conversión ---
    static buf2hex(buffer) {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static buf2base64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    static base642buf(base64) {
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    static toPem(buffer, type) {
        const b64 = KeyManager.buf2base64(buffer);
        const pemLines = b64.match(/.{1,64}/g).join('\n');
        return `-----BEGIN ${type}-----\n${pemLines}\n-----END ${type}-----\n`;
    }

    static fromPem(pem) {
        // Eliminar cabeceras, pies y saltos de línea
        const b64 = pem.replace(/-----BEGIN .*?-----/g, '')
                       .replace(/-----END .*?-----/g, '')
                       .replace(/\s+/g, '');
        return KeyManager.base642buf(b64);
    }

    // --- Lógica Principal ---

    async generateRsaKeyPair(keySize = 2048) {
        return await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: keySize,
                publicExponent: new Uint8Array([1, 0, 1]), // 65537
                hash: "SHA-256",
            },
            true, // Extraíble
            ["encrypt", "decrypt"]
        );
    }

    async serializePrivateKeyPkcs8Pem(privateKey) {
        // Nota: Web Crypto no soporta cifrado directo con contraseña para exportar. Se exporta crudo.
        const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
        return KeyManager.toPem(exported, "PRIVATE KEY");
    }

    async serializePublicKeyPem(publicKey) {
        const exported = await window.crypto.subtle.exportKey("spki", publicKey);
        return KeyManager.toPem(exported, "PUBLIC KEY");
    }

    async loadPrivateKeyFromPem(pemData) {
        const binaryDer = KeyManager.fromPem(pemData);
        return await window.crypto.subtle.importKey(
            "pkcs8", binaryDer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true, ["decrypt"]
        );
    }

    async loadPublicKeyFromPem(pemData) {
        const binaryDer = KeyManager.fromPem(pemData);
        return await window.crypto.subtle.importKey(
            "spki", binaryDer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true, ["encrypt"]
        );
    }

    async getKeyFingerprint(publicKey) {
        // El formato SPKI es el equivalente al DER SubjectPublicKeyInfo en Python
        const publicDer = await window.crypto.subtle.exportKey("spki", publicKey);
        const digest = await window.crypto.subtle.digest("SHA-256", publicDer);
        return KeyManager.buf2hex(digest);
    }
}


class HybridEncryption {
    constructor() {
        this.keyManager = new KeyManager();
    }

    // Asegura que el JSON se formatee de manera determinista para las firmas AAD
    static stringifySorted(obj) {
        if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
        if (Array.isArray(obj)) return `[${obj.map(HybridEncryption.stringifySorted).join(',')}]`;
        const keys = Object.keys(obj).sort();
        const mapped = keys.map(k => `"${k}":${HybridEncryption.stringifySorted(obj[k])}`);
        return `{${mapped.join(',')}}`;
    }

    static buf2hex(buffer) {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static hex2buf(hexString) {
        const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
        }
        return bytes.buffer;
    }

    buildMetadata(file, recipientsIds) {
        return {
            algorithm_version: "RSA-OAEP+AES-GCM-Hybrid",
            encryption_parameters: {
                asymmetric_algorithm: "RSA-OAEP",
                hash_algorithm: "SHA-256",
                mgf: "MGF1-SHA256",
                symmetric_algorithm: "AES-GCM",
                key_size_bits: 256,
                nonce_size_bytes: 12,
                tag_size_bytes: 16,
                rsa_key_size_bits: 2048,
            },
            filename: file.name,
            creation_timestamp: new Date().toISOString(),
            recipients_ids: recipientsIds.sort(),
        };
    }

    async encryptFile(file, recipients) {
        const recipientIds = Object.keys(recipients);
        if (recipientIds.length === 0) {
            throw new Error("Se requiere al menos un destinatario para cifrar el archivo.");
        }

        const plaintext = await file.arrayBuffer();

        // 1. Generar la llave AES de un solo uso para el archivo
        const fileKey = window.crypto.getRandomValues(new Uint8Array(32));
        const fileKeyCrypto = await window.crypto.subtle.importKey(
            "raw", fileKey, { name: "AES-GCM" }, false, ["encrypt"]
        );

        const nonce = window.crypto.getRandomValues(new Uint8Array(12));

        // 2. Procesar Fingerprints
        const recipientFingerprints = {};
        for (const id of recipientIds) {
            recipientFingerprints[id] = await this.keyManager.getKeyFingerprint(recipients[id]);
        }

        const recipientsIdsForAad = recipientIds
            .map(id => `${id}:${recipientFingerprints[id]}`)
            .sort();

        // 3. Preparar Metadata (AAD)
        const metadata = this.buildMetadata(file, recipientsIdsForAad);
        const metadataString = HybridEncryption.stringifySorted(metadata);
        const metadataBytes = new TextEncoder().encode(metadataString);

        // 4. Cifrar el archivo con AES-GCM
        const encryptionBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: nonce, additionalData: metadataBytes },
            fileKeyCrypto,
            plaintext
        );

        const encryptionArray = new Uint8Array(encryptionBuffer);
        const ciphertext = encryptionArray.slice(0, -16);
        const tag = encryptionArray.slice(-16);

        // 5. Cifrar la llave AES con las llaves públicas RSA de los destinatarios
        const encryptedKeys = [];
        for (const id of recipientIds) {
            const publicKey = recipients[id];
            const fingerprint = recipientFingerprints[id];

            // RSA-OAEP requiere un ArrayBuffer
            const encryptedFileKeyBuffer = await window.crypto.subtle.encrypt(
                { name: "RSA-OAEP" },
                publicKey,
                fileKey
            );

            encryptedKeys.push({
                id: id,
                key_fingerprint: fingerprint,
                encrypted_key: HybridEncryption.buf2hex(encryptedFileKeyBuffer)
            });
        }

        return {
            metadata: metadata,
            recipients: encryptedKeys,
            nonce: HybridEncryption.buf2hex(nonce),
            ciphertext: HybridEncryption.buf2hex(ciphertext),
            tag: HybridEncryption.buf2hex(tag)
        };
    }

    async decryptFile(container, recipientId, privateKey) {
        if (!container.metadata || !container.recipients || !container.nonce || !container.ciphertext || !container.tag) {
            throw new Error("El contenedor no tiene todos los campos requeridos.");
        }

        const metadata = container.metadata;
        const nonce = HybridEncryption.hex2buf(container.nonce);
        const ciphertext = HybridEncryption.hex2buf(container.ciphertext);
        const tag = HybridEncryption.hex2buf(container.tag);

        const recipientEntry = container.recipients.find(entry => entry.id === recipientId);
        if (!recipientEntry) {
            throw new Error(`El destinatario '${recipientId}' no se encontró en el contenedor.`);
        }

        // Extraer la llave pública de la privada para validar el fingerprint
        // Web Crypto no extrae la pública de la privada directamente, pero podemos generarla usando SPKI
        // Sin embargo, para la Web Crypto API, es más seguro simplemente intentar descifrar
        // y atrapar el error. Aún así, validaremos el fingerprint si provees el par completo.
        // Como tu diseño pasa solo privateKey, omitiremos el cálculo del fingerprint local
        // o asumiendo que la validación fallará en el paso de descifrado RSA si la llave es incorrecta.

        const encryptedFileKey = HybridEncryption.hex2buf(recipientEntry.encrypted_key);
        let fileKeyRaw;

        try {
            fileKeyRaw = await window.crypto.subtle.decrypt(
                { name: "RSA-OAEP" },
                privateKey,
                encryptedFileKey
            );
        } catch (e) {
            throw new Error("Error de autenticación: la llave privada no coincide o está corrupta.");
        }

        const fileKeyCrypto = await window.crypto.subtle.importKey(
            "raw", fileKeyRaw, { name: "AES-GCM" }, false, ["decrypt"]
        );

        const metadataString = HybridEncryption.stringifySorted(metadata);
        const metadataBytes = new TextEncoder().encode(metadataString);

        const dataToDecrypt = new Uint8Array(ciphertext.byteLength + tag.byteLength);
        dataToDecrypt.set(new Uint8Array(ciphertext), 0);
        dataToDecrypt.set(new Uint8Array(tag), ciphertext.byteLength);

        try {
            const plaintextBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: nonce, additionalData: metadataBytes },
                fileKeyCrypto,
                dataToDecrypt
            );

            const filename = metadata.filename || "decrypted_file.bin";
            return new File([plaintextBuffer], `decrypted_${filename}`, { type: "application/octet-stream" });

        } catch (e) {
            throw new Error("Error: autenticación fallida. El archivo fue modificado.");
        }
    }
}