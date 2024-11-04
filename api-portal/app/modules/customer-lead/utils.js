const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const { excelHeaderStyle } = require('./constants');

const folderName = 'customer-lead';

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

const addSheet = ({ workbook, sheetName, header, data = [], isIndex = true, headerStyle = excelHeaderStyle }) => {
    if (isIndex) {
        header = { index: 'STT', ...header };
        data = data.map((item, index) => ({ ...item, index: index + 1 }));
    }

    const worksheet = workbook.addWorksheet(sheetName, {});
    const _headerStyle = workbook.createStyle(headerStyle);
    data.unshift(header);

    const columnKeys = Object.keys(header);
    for (let indexCol = 1; indexCol <= columnKeys.length; indexCol++) {
        const width = columnKeys[indexCol - 1] === 'index' ? 5 : 20;
        worksheet.column(indexCol).setWidth(width);
        worksheet.cell(1, indexCol).style(_headerStyle);
    }
    data.forEach((item, indexRow) => {
        columnKeys.forEach((key, indexCol) => {
            worksheet.cell(indexRow + 1, indexCol + 1).string((item[key] || '').toString());
        });
    });
};

module.exports = {
    getImageUrl,
    createGuid,
    addSheet,
};
