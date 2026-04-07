import { xchacha20poly1305 } from "./src/chacha.js";
import { randomBytes, bytesToHex, hexToBytes} from "./src/utils.js";




export class KeyManger{

    /*
        Convert an ArrayBuffer into a string
        from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
    */
    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    /**
        SubjectPublicKeyInfor export
     *@returns {string}
    */
    async exportPublicCryptoKey(publicCryptoKey){
        const exported = await window.crypto.subtle.exportKey(
            "spki",
            publicCryptoKey
        );
        const exportedAsString = this.ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        return exportedAsBase64;
    }

    /**
        PKCS #8
     *@returns {string}
    */
    async exportPrivateCryptoKey(privateCryptoKey){
        const exported = await window.crypto.subtle.exportKey('pkcs8',privateCryptoKey);
        const exportedAsString = this.ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        return exportedAsBase64;
    }

    async generate_key_pair(){
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"],
        );

        const publicKey = await this.exportPublicCryptoKey(keyPair.publicKey);
        const privateKey = await this.exportPrivateCryptoKey(keyPair.privateKey);

        return {publicKey, privateKey}
    }

}

export class Encryption{


    /*
        Convert a string into an ArrayBuffer
        from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
    */
    str2ab(str) {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++){
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }


    /**
     *@param {string} key
    */
    async prepareKeyforEncryption(publicKey){

        const binaryDerString = window.atob(publicKey);
        const binaryDer = this.str2ab(binaryDerString);

        return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
        );
    }

    /**
     *@typedef {Object} UserInfo
     *@property {string} username
     *@property {string} key

     *@typedef {Object} CipherObject
     *@property {Uint8Array} data
     *@property {string} file_name
     *@property {string} type
     *@property {string} ownerKey
     *@property {UserInfo[]} recipients

     *@param {CipherObject} cipherObject
    */
    async encrypt_file(cipherObject){


        // Parameters for Symmetric Encryption
        const key = randomBytes(32);
        const nonce = randomBytes(24);


        const ownerCryptoKey = await this.prepareKeyforEncryption(cipherObject.ownerKey);
        let encryptedKey  = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            ownerCryptoKey,
            key
        );
        cipherObject.ownerKey = bytesToHex(new Uint8Array(encryptedKey));

        for (const recipient of cipherObject.recipients){
            const recipientCryptoKey = await this.prepareKeyforEncryption(recipient.key);
            encryptedKey = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                recipientCryptoKey,
                key
            );
            recipient.key = bytesToHex(new Uint8Array(encryptedKey));
        }

        //Metadata
        const metaData = {
            symmetric_algorithm: "XChaCha20+Poly1305",
            key_size_bits: 256,
            nonce_size_bytes: 24,
            nonce: bytesToHex(nonce),
            tag_size_bytes: 16,
            asymmetric_algorithm: "RSA-OAEP",
            ownerKey: cipherObject.ownerKey,
            recipients: cipherObject.recipients,
            rsa_key_size_bits: 2048,
            file_name: cipherObject.file_name,
            extension: cipherObject.type,
            created_at: new Date().toISOString()
        };

        const metaDataString = JSON.stringify(metaData);
        const aad = new TextEncoder().encode(metaDataString);
        const chacha = xchacha20poly1305(key, nonce, aad);
        const cipherText = chacha.encrypt(cipherObject.data);

        return {cipherText, metaData};
    }

    async prepareKeyforDecryption(privateKey){
        const binaryDerString = window.atob(privateKey);
        const binaryDer = this.str2ab(binaryDerString);

        return await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
        );
    }

    /*
    cipherText,metaDataString,recipientKey,privateKey,nonce
    */
    async decrypt_file(metaData,cipherText,privateKey,recipientKey){

        const cryptoKey = await this.prepareKeyforDecryption(privateKey);
        const symmetricKeyBuffer = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            cryptoKey,
            hexToBytes(recipientKey)
        );

        const symmetricKey = new Uint8Array(symmetricKeyBuffer);

        const nonce = hexToBytes(metaData.nonce);
        const metaDataString = JSON.stringify(metaData);
        const aad = new TextEncoder().encode(metaDataString);

        const chacha = xchacha20poly1305(symmetricKey, nonce, aad);
        const data = chacha.decrypt(cipherText);
        return data;
    }

}
