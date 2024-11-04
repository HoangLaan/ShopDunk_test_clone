var graylog2 = require("graylog2");
const config = require("../../../config/config");
const os = require('os');
var hostname = os.hostname();
const ServiceResponse = require('../../common/responses/service.response');

var logger = new graylog2.graylog({
    servers: [{ host: config.graylog.ip, port: config.graylog.port }],
    hostname: hostname,
    facility: 'xcel',
    bufferSize: 1350
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


const stringifyError = (error) => {
    const errorJson = JSON.stringify(error, (key, value) => {
        if (value instanceof Error) {
            let error = {};
            Object.getOwnPropertyNames(value).forEach((key) => {
                error[key] = value[key];
            });
            return error;
        }
        return value;
    });

    return errorJson;
};


const WriteGrayLog = (title, error, Module, UserLogin = 'administrator') => {
    let randomString = makeid(5);
    title += `(${randomString})`;
    try {
        let dataLog = {
            ErrorCode: randomString,
            Title: title,
            Content: stringifyError(error),
            Module,
            UserLogin,
            MachineName: hostname,
            Project: config.graylog.project,
        }
        logger.log(stringifyError(error), dataLog)

    } catch (error) { }
    return new ServiceResponse(false, title, null);
}

module.exports = {
    WriteGrayLog
}
