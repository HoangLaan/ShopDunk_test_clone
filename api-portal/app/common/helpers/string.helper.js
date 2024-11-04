const config = require('../../../config/config');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
const moment = require('moment');

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

const encryptString = (text) => CryptoJS.AES.encrypt(text, config.hashSecretKey).toString();

const decryptString = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, config.hashSecretKey);
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

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const buildProductImeiCode = (productCode = '', count = 0, rightNum = 5, date = moment().format('YYMMDD')) => {
    count = count + 1;
    count = pad(count, rightNum);
    productCode = `${productCode}`.replace(/[0-9]/g, '');
    productCode = `${productCode}${date}${count}`;
    return productCode;
};

const buildSku = (stocks_id = '', count = 0, rightNum = 5, date = moment().format('YYMMDD')) => {
    count = count + 1;
    count = pad(count, rightNum);
    return `${pad(stocks_id, 4)}${date}${count}`;
};

const changeToSlug = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    //Đổi ký tự có dấu thành không dấu
    str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    str = str.replace(/đ/gi, 'd');

    str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    // console.log(str)
    return str;
};

const pad = (num, size) => {
    var s = '000000000' + num;
    return s.substr(s.length - size);
};

const checkValidId = (id) => {
    return Number.isInteger(Number(id)) && Number(id) > 0;
};

function toNonAccentVietnamese(str) {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
}

module.exports = {
    toLowerCaseString,
    compareStrings,
    getLastDigitString,
    encryptString,
    decryptString,
    stringIsExistsInArray,
    hashPassword,
    comparePassword,
    buildProductImeiCode,
    changeToSlug,
    buildSku,
    checkValidId,
    toNonAccentVietnamese,
};
