const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const createOrUpdate = async (interestId) => {
    try {
        const decodeString = Buffer.from(interestId, 'base64').toString('ascii');
        const [typeSend, customerCode] = decodeString.split('_');
        const TYPE_SEND = {
            ZALO: typeSend === 'ZALO' || null,
            SMS: typeSend === 'SMS' || null,
            EMAIL: typeSend === 'EMAIL' || null
        }
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('CUSTOMERCODE', customerCode)
            .input('ISSENDEMAIL', TYPE_SEND.EMAIL)
            .input('ISSENDSMS', TYPE_SEND.SMS)
            .input('ISSENDZALOOA', TYPE_SEND.ZALO)
            .execute('CRM_ACCOUNT_INTEREST_CreateOrUpdate_AdminWeb');

        const idResult = result.recordset[0].RESULT;
        if (!idResult) {
            return new ServiceResponse(false, 'Lỗi lưu loại tài khoản quan tâm');
        }
        return new ServiceResponse(true, 'Lưu tài khoản quan tâm thành công');
    } catch (e) {
        logger.error(e, { function: 'interestService.createOrUpdate' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    createOrUpdate,
};
