const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const settingClass = require('./setting.class');
const config = require('../../../config/config');
const logger = require('../../common/classes/logger.class');
const {WriteGrayLog} = require('../../common/classes/graylog.class');

const updateBiometric = async (userId, biometricHash = '') => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', userId)
            .input('BIOMETRIC', biometricHash)
            .execute('SYS_USER_UpdateBiometric_App');
        const res = data.recordset[0];
        if (res.RESULT) {
            return new ServiceResponse(true, 'success', {is_success:1});
        } else {
            return new ServiceResponse(false, 'failed', {is_success:0});
        }
    } catch (error) {
        logger.error(error, {
            function: 'setting.service.updateBiometric',
        });
        return WriteGrayLog('Lỗi cập nhật thông tin biometric.', error, 'setting.service.updateBiometric');
    }
};

module.exports = {
    updateBiometric,
};
