const { MAIL_STATUS, RAW_MAIL_STATUS } = require('./contants');

const convertMailStatus = (rawMailStatus) => {
    if ([RAW_MAIL_STATUS.SENT].includes(rawMailStatus)) {
        return MAIL_STATUS.SUCCESS;
    }
    if ([RAW_MAIL_STATUS.QUEUED, RAW_MAIL_STATUS.SCHEDULED].includes(rawMailStatus)) {
        return MAIL_STATUS.WAIT;
    }
    if ([RAW_MAIL_STATUS.REJECTED, RAW_MAIL_STATUS.INVALID].includes(rawMailStatus)) {
        return MAIL_STATUS.FAILD;
    }
    return MAIL_STATUS.PROCESSING;
};

const convertTemplate = (template) => {
    const step1 = template.replaceAll('{{', '*|');
    const step2 = step1.replaceAll('}}', '|*');
    return step2;
};

const mergeVarsToTemplate = (email, templateHtml, mergeVars) => {
    const targetMail = mergeVars.find((_) => _.rcpt === email);
    if (targetMail) {
        return targetMail.vars.reduce((html, mergeVar) => {
            return html.replaceAll(`{{${mergeVar.name}}}`, mergeVar.content || '');
        }, templateHtml);
    }
    return templateHtml;
};

module.exports = {
    convertMailStatus,
    convertTemplate,
    mergeVarsToTemplate,
};
