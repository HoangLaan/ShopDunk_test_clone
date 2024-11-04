const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const customerCouponClass = require('./customer-coupon.class');
const { spName } = require('./constants');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('SEARCHTYPE', apiHelper.getValueFromObject(queryParams, 'search_type'))
            .input('USEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'used_date_from'))
            .input('USEDDATETO', apiHelper.getValueFromObject(queryParams, 'used_date_to'))
            .input('ISORDERRED', apiHelper.getValueFromObject(queryParams, 'is_ordered'))
            .input('ISMEMBER', apiHelper.getValueFromObject(queryParams, 'is_member'))
            .input('ISUSED', apiHelper.getValueFromObject(queryParams, 'is_used'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('STAFFUSER', apiHelper.getValueFromObject(queryParams, 'staff_user'))
            .input('SUPERVISORNAME', apiHelper.getValueFromObject(queryParams, 'supervisor_user'))
            .execute(spName.getList);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: customerCouponClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'customerCouponService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (customerCouponId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('CUSTOMERCOUPONID', customerCouponId).execute(spName.getById);

        if (!data.recordset[0]) {
            return new ServiceResponse(false, 'Không tìm thấy mã giảm giá - khách hàng');
        }

        return new ServiceResponse(true, '', customerCouponClass.getById(data.recordset[0]));
    } catch (error) {
        logger.error(error, { function: 'customerCouponService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('COUPONAUTOCODEID', apiHelper.getValueFromObject(body, 'coupon_auto_code_id'))
            .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
            .input('ISUSED', apiHelper.getValueFromObject(body, 'is_used'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(spName.createOrUpdate);

        const idResult = result.recordset[0].RESULT;
        if (!idResult) {
            return new ServiceResponse(false, 'Lỗi lưu mã giảm giá - khách hàng');
        }
        return new ServiceResponse(true, 'Lưu mã giảm giá - khách hàng thành công', {
            customer_coupon_id: idResult,
        });
    } catch (error) {
        logger.error(error, { function: 'customerCouponService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const _delete = async (bodyParams) => {
    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'CUSTOMERCOUPONID')
            .input('TABLENAME', 'CRM_CUSTOMERCOUPON')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'customerCouponService._delete' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    getList,
    getById,
    createOrUpdate,
    delete: _delete,
};
