const CryptoJS = require('crypto-js');

class Crypto {
    #key = 'blackwind';

    encodeData(data) {
        return CryptoJS.TripleDES.encrypt(data, this.#key).toString();
    }

    decodeData(data) {
        return CryptoJS.TripleDES.decrypt(data, this.#key).toString(CryptoJS.enc.Utf8);
    }
}

module.exports = {
    crypto: new Crypto(),
};
