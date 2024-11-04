const OffWorkTypeClass = require('./offwork-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListOffWorkRlUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OFFWORKTYPEID', apiHelper.getValueFromObject(queryParams, 'off_work_type_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('HR_OFFWORK_LEVEL_USER_GetByOffWorkType_App');

        const rlUsers = OffWorkTypeClass.listRlUser(data.recordset, false);
        const res = rlUsers.reduce((acc, curr) => {
            if (!acc[(curr.offwork_review_level_id, curr.offwork_review_level_name)])
                acc[(curr.offwork_review_level_id, curr.offwork_review_level_name)] = []; //If this type wasn't previously stored
            acc[(curr.offwork_review_level_id, curr.offwork_review_level_name)].push({
                offwork_review_level_id: curr.offwork_review_level_id,
                full_name: curr.full_name,
                username: curr.username,
                user_id: curr.user_id,
                default_picture_url: curr.default_picture_url,
                company_id: curr.company_id,
                is_auto_review: curr.is_auto_review,
                phone_number: curr.phone_number,
                department_id: curr.department_id,
                department_name: curr.department_name,
            });
            return acc;
        }, {});
        const result = Object.keys(res).map(key => {
            let objUsers = res[key];
            let users = Object.keys(objUsers).map(key1 => {
                return {
                    full_name: objUsers[key1].full_name,
                    username: objUsers[key1].username,
                    user_id: objUsers[key1].user_id,
                    default_picture_url: objUsers[key1].default_picture_url,
                    company_id: objUsers[key1].company_id,
                    phone_number: objUsers[key1].phone_number,
                    department_id: objUsers[key1].department_id,
                    department_name: objUsers[key1].department_name,
                };
            });
            return {
                offwork_review_level_name: key,
                offwork_review_level_id: res[key][0].offwork_review_level_id,
                company_id: res[key][0].company_id,
                users: users,
                is_auto_review: res[key][0].is_auto_review,
            };
        });
        return new ServiceResponse(true, '', {
            items: result,
        });
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.getListOffWorkRlUser' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptions = async params => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_OFFWORKTYPE_GetOptions_App');
        return new ServiceResponse(true, '', OffWorkTypeClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.getOptions' });
        return new ServiceResponse(true, '', []);
    }
};

module.exports = {
    getListOffWorkRlUser,
    getOptions,
};
