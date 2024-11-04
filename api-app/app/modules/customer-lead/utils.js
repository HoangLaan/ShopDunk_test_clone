const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');

const folderName = 'customer';

const getImageUrl = async (base64) => {
    let url = null;

    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const guid = createGuid();
            url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'CustomerLeadUtil.getImageUrl',
        });
    }
    return url;
};

const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

module.exports = {
    getImageUrl,
    createGuid,
};
