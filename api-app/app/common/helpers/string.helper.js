const config = require('../../../config/config');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
var aesjs = require('aes-js');
var pbkdf2 = require('pbkdf2');

const toLowerCaseString = (text = '') => (text || '').trim().toLowerCase();

const compareStrings = (currentValue, nextValue, desc = false) => {
    let comparison = 0;
    const currVal = toLowerCaseString(currentValue);
    const nextVal = toLowerCaseString(nextValue);
    if (currVal > nextVal) {
        comparison = 1;
    } else if (nextVal > currVal) {
        comparison = -1;
    }
    return comparison * (desc ? -1 : 1);
};

const getLastDigitString = (text = '', num = 4) => (text || '').trim().substring(text.length - num);

const encryptString = text => CryptoJS.AES.encrypt(text, config.hashSecretKey).toString();

const decryptString = text => {
    const bytes = CryptoJS.AES.decrypt(text, config.hashSecretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptChatPassword = text => CryptoJS.AES.encrypt(text, config.chatHashSecretKey).toString();

const decryptChatPassword = text => {
    const bytes = CryptoJS.AES.decrypt(text, config.chatHashSecretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const stringIsExistsInArray = (list = [], string = '') => {
    let isExisted = false;
    for (let item of list) {
        if ((item || '').toLowerCase().indexOf(string) > -1) {
            isExisted = true;
            break;
        }
    }
    return isExisted;
};

const hashPassword = password => {
    return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const randomString = length => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const randomOTP = length => {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const encryptCTRCounter = (text, key) => {
    try {
        let key_256 = pbkdf2.pbkdf2Sync(key, 'salt', 1, 256 / 8, 'sha512');
        let textBytes = aesjs.utils.utf8.toBytes(text);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
        let encryptedBytes = aesCtr.encrypt(textBytes);
        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    } catch (error) {
        throw new Error('Error encrypt');
    }
};

const decryptCTRCounter = (text, key) => {
    try {
        let key_256 = pbkdf2.pbkdf2Sync(key, 'salt', 1, 256 / 8, 'sha512');
        let encryptedBytes = aesjs.utils.hex.toBytes(text);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText;
    } catch (error) {
        // console.log(error)
        throw new Error('Error decrypt');
    }
};

const checkValidId = id => {
    return Number.isInteger(Number(id)) && Number(id) > 0;
};

module.exports = {
    toLowerCaseString,
    compareStrings,
    getLastDigitString,
    encryptString,
    decryptString,
    encryptChatPassword,
    decryptChatPassword,
    stringIsExistsInArray,
    hashPassword,
    comparePassword,
    randomString,
    randomOTP,
    encryptCTRCounter,
    decryptCTRCounter,
    checkValidId,
};
