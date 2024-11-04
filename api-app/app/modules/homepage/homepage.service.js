const moduleClass = require('./homepage.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const {STORE_HOMEPAGE} = require('./constant');

const parseUnread = value => {
    if (value) return value ?? 0;
};

const getHomepageStatisticalData = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const homepageStatisticalResData = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(STORE_HOMEPAGE.HOMEPAGE_GETSTATISTIC);

        return new ServiceResponse(true, '', moduleClass.statisticalData(homepageStatisticalResData.recordset[0]));
    } catch (e) {
        logger.error(e, {function: 'homepageService.getHomepageStatisticalData'});
        return new ServiceResponse(false, e.message);
    }
};

const getHomepageMailboxData = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const homepageMailboxResData = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(STORE_HOMEPAGE.HOMEPAGE_GETMAIL);

        let mailList = moduleClass.listMail(homepageMailboxResData.recordset);

        const mailAttachmentList = moduleClass.listMailAttachment(homepageMailboxResData.recordsets[2]);

        mailList = mailList.map(el => {
            const attachmentList = mailAttachmentList.filter(attachment => attachment.mail_id === el.mail_id);

            return {
                ...el,
                attachment_list: attachmentList,
            };
        });
        // mailList.forEach(el => {
        // let mail_content = el.mail_content;

        // mail_content = mail_content.replace(/(<([^>]+)>)/gi, '');
        // mail_content = mail_content.substr(0, 49);

        // if (el.mail_content.length > 50) mail_content += '...';

        // el.mail_content = mail_content;
        // });

        return new ServiceResponse(true, '', {
            mail_list: mailList,
            total_unread: parseUnread(homepageMailboxResData.recordsets[1][0].TOTALMAILUNREAD),
        });
    } catch (e) {
        logger.error(e, {function: 'homepageService.getHomepageMailboxData'});
        return new ServiceResponse(false, e.message);
    }
};

const getHomepageAnnounceData = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const homepageAnnounceResData = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(STORE_HOMEPAGE.HOMEPAGE_GETANNOUNCE);

        let announceList = moduleClass.listAnnounce(homepageAnnounceResData.recordset);

        const announceAttachmentList = moduleClass.listAnnounceAttachment(homepageAnnounceResData.recordsets[2]);

        announceList = announceList.map(el => {
            const attachmentList = announceAttachmentList.filter(
                attachment => attachment.announce_id === el.announce_id,
            );
            return {
                ...el,
                attachment_list: attachmentList,
            };
        });

        // announceList.forEach(el => {
        // let description = el.description;

        // description = description.replace(/(<([^>]+)>)/gi, '');
        // description = description.substr(0, 49);

        // if (el.description.length > 50) description += '...';

        // el.description = description;
        // });

        return new ServiceResponse(true, '', {
            mail_list: announceList,
            total_unread: parseUnread(homepageAnnounceResData.recordsets[1][0].TOTALUNREAD),
        });
    } catch (e) {
        logger.error(e, {function: 'homepageService.getHomepageAnnounceData'});
        return new ServiceResponse(false, e.message);
    }
};

const getHomepageNewsData = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const homepageNewsResData = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(STORE_HOMEPAGE.HOMEPAGE_GETNEW);

        return new ServiceResponse(true, '', moduleClass.listNews(homepageNewsResData.recordset));
    } catch (e) {
        logger.error(e, {function: 'homepageService.getHomepageNewsData'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getHomepageStatisticalData,
    getHomepageMailboxData,
    getHomepageAnnounceData,
    getHomepageNewsData,
};
