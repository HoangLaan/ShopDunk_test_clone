const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

const saveFile = async (base64, folderNameImg) => {
    let url = null;
    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const d = new Date();
            const nameFile = String(d.getDay().toString()) + d.getMonth().toString() + d.getFullYear().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() + d.getMilliseconds().toString();
            url = await fileHelper.saveImage(base64);
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, { 'function': 'uploadFile.saveFile' });
        return new ServiceResponse(false, '', url);
    }
    if (url === '') {
        return new ServiceResponse(false, '', url);
    }
    return new ServiceResponse(true, '', `${config.domain_cdn}${url}`);
};
module.exports = {
    saveFile,
};
