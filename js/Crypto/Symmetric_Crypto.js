import { xchacha20poly1305 } from "./src/chacha.js";
import { randomBytes } from "./src/utils.js";




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
    prepareKeyforEncryption(publicKey){

        const binaryDerString = window.atob(publicKey);
        const binaryDer = this.str2abstr2ab(binaryDerString);

        return window.crypto.subtle.importKey(
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
     *@property {string} publicKey

     *@typedef {Object} CipherObject
     *@property {Uint8Array} data
     *@property {string} file_name
     *@property {string} extension
     *@property {string} ownerKey
     *@property {UserInfo[]} recipients

     *@param {CipherObject} cipherObject
    */
    async encrypt_file(cipherObject){


        // Parameters for Symmetric Encryption
        const key = randomBytes(32);
        const nonce = randomBytes(24);


        const ownerCryptoKey = this.prepareKeyforEncryption(cipherObject.ownerKey);
        cipherObject.ownerKey = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            ownerCryptoKey,
            key
        );

        for (const recipient of cipherObject.recipients){
            const recipientCryptoKey = this.prepareKeyforEncryption(recipient.publicKey);
            recipient.key = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                recipientCryptoKey,
                key
            );
        }

        //Metadata
        const metaData = {
            symmetric_algorithm: "XChaCha20+Poly1305",
            key_size_bits: 256,
            nonce_size_bytes: 24,
            tag_size_bytes: 16,
            asymmetric_algorithm: "RSA-OAEP",
            ownerKey: ownerKey,
            recipients: recipients,
            rsa_key_size_bits: 2048,
            file_name: cipherObject.file_name,
            extension: extension,
            created_at: new Date().toISOString()
        };


        const metaDataString = JSON.stringify(metaData);
        const aad = new TextEncoder().encode(metaDataJSON);
        const chacha = xchacha20poly1305(key, nonce, aad);
        const cipherText = chacha.encrypt(cipherObject.data);

        return {cipherText, metaDataString};
    }

    prepareKeyforDecryption(privateKey){
        const binaryDerString = window.atob(privateKey);
        const binaryDer = this.str2ab(binaryDerString);

        return window.crypto.subtle.importKey(
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

    async decrypt_file(cipherText,metaDataString,recipientKey,privateKey,nonce){

        const cryptoKey = this.prepareKeyforDecryption(privateKey);
        const symmetricKey = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            cryptoKey,
            recipientKey
        );
        const aad = new TextEncoder().encode(metaDataString);
        const chacha = xchacha20poly1305(symmetricKey, nonce, aad);
        const data = chacha.decrypt(cipherText);
        return data;
    }

}
