const { changeToSlug } = require('../../common/helpers/string.helper');
const moment = require('moment');

const attachIdToOptions = (options) => options.map((opt) => ({ ...opt, name: `${opt.id} - ${opt.name}` }));

function validateRequired(value, errorHandler) {
    !value && errorHandler(value);
}

function validatePositiveInteger(value, errorHandler) {
    (!Number.isInteger(Number(value)) || Number(value) < 0) && errorHandler(value);
}

function validateSpecialChar(value, errorHandler) {
    if (value) {
        const speicalCharRegex = /^[a-zA-Z0-9\s]*$/;
        !speicalCharRegex.test(value) && errorHandler(value);
    }
}
function validateDate(value, errorHandler) {
    DATE_FORMAT = 'DD/MM/YYYY';
    if (value) {
        const time = moment(value, DATE_FORMAT);
        !time.isValid() && errorHandler(value);
    }
}

function validateMaxLength(value, maxLength = 10, errorHandler) {
    value && String(value).length > maxLength && errorHandler(value);
}

function validateBooleanValue(value, truethyValues = ['1'], falsyValues = ['0'], successHandler, errorHandler) {
    if (truethyValues.includes(changeToSlug(value))) {
        successHandler(1);
    } else if (falsyValues.includes(changeToSlug(value))) {
        successHandler(0);
    } else {
        errorHandler();
    }
}

module.exports = {
    attachIdToOptions,
    validateRequired,
    validateSpecialChar,
    validateMaxLength,
    validateBooleanValue,
    validateDate,
    validatePositiveInteger,
};
