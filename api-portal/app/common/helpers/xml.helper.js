const FsPromise = require('fs').promises;
const fs = require('fs');
const { tryCatch } = require('bullmq');
const xml2js = require('xml2js');
const logger = require('../classes/logger.class');

const XML_DIRECTORY = 'storage/xml';

const createXMLFile = async (data, fileName) => {
    try {
        // Create the log directory if it does not exist
        if (!fs.existsSync(XML_DIRECTORY)) {
            fs.mkdirSync(XML_DIRECTORY);
        }

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(data);

        const filePath = XML_DIRECTORY + '/' + fileName;

        await FsPromise.writeFile(filePath, xml);
        return filePath;
    } catch (error) {
        logger.error(error?.message || 'Tạo file xml xảy ra lỗi !');
        return false;
    }
};

module.exports = {
    createXMLFile,
};
