const supplierClass = require('../supplier/supplier.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const { saveImage, saveFile } = require('../../common/helpers/file.helper');
/**
 * Get list CRM_SUPPLIER
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListSupplier = async (queryParams) => {
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
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            // .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            // .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('SUPPLIERNAME', apiHelper.getValueFromObject(queryParams, 'supplier_name'))
            .input('ALTNAME', apiHelper.getValueFromObject(queryParams, 'altname'))
            // .input('PHONENUMBER', apiHelper.getValueFromObject(queryParams, 'phonenumber'))
            .execute(PROCEDURE_NAME.MD_SUPPLIER_GETLIST);

        const item = data.recordset;
        return new ServiceResponse(true, '', {
            data: supplierClass.list(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'supplierService.getListSupplier' });
        return new ServiceResponse(true, '', {});
    }
};

const detailSupplier = async (supplier_id) => {
    try {
        const pool = await mssql.pool;

        const supplier_ = await pool
            .request()
            .input('SUPPLIERID', supplier_id)
            .execute(PROCEDURE_NAME.MD_SUPPLIER_GETBYID);

        let supplier = supplier_.recordset;
        // If exists MD_SUPPLIER
        if (supplier && supplier.length > 0) {
            supplier = supplierClass.detail(supplier[0]);

            const supplierApis_ = await pool
                .request()
                .input('SUPPLIERID', supplier_id)
                .execute('MD_SUPPLIER_API_GetBySupplierId');
            let supplierApis = supplierApis_.recordset;
            if (supplierApis && supplierApis.length) {
                supplier = { ...supplier, supplier_api_list: supplierClass.apiDetail(supplierApis) };
            }

            return new ServiceResponse(true, '', supplier);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'supplierService.detailSupplier' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteSupplier = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'SUPPLIERID')
            .input('TABLENAME', 'MD_SUPPLIER')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'SupplierService.service.deleteSupplier' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const supplier_id = apiHelper.getValueFromObject(bodyParams, 'supplier_id');

        // check trùng mã nhà cung cấp
        const datacheck = await pool
            .request()
            .input('SUPPLIERID', supplier_id)
            .input('SUPPLIERCODE', apiHelper.getValueFromObject(bodyParams, 'supplier_code'))
            .execute('MD_SUPPLIER_CheckExistCode_AdminWeb');
        if (datacheck.recordset && datacheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, 'Mã nhà cung cấp đã tồn tại.');
        }

        let logo_url = apiHelper.getValueFromObject(bodyParams, 'logo_url', null);
        if (logo_url) {
            const path_logo_url = await saveFile(logo_url);
            if (path_logo_url) {
                logo_url = path_logo_url;
            } else {
                logo_url = null;
            }
        }

        let password = apiHelper.getValueFromObject(bodyParams, 'password');

        const data = await pool
            .request()
            .input('SUPPLIERID', supplier_id)
            .input('SUPPLIERNAME', apiHelper.getValueFromObject(bodyParams, 'supplier_name'))
            .input('SUPPLIERCODE', apiHelper.getValueFromObject(bodyParams, 'supplier_code'))
            .input('ALTNAME', apiHelper.getValueFromObject(bodyParams, 'altname'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('REPRESENTATIVEGENDER', apiHelper.getValueFromObject(bodyParams, 'representative_gender'))
            .input('REPRESENTATIVENAME', apiHelper.getValueFromObject(bodyParams, 'representative_name'))
            .input('REPRESENTATIVEEMAIL', apiHelper.getValueFromObject(bodyParams, 'representative_email'))
            .input('REPRESENTATIVEPHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'representative_phonenumber'))
            .input('REPRESENTATIVEPOSITION', apiHelper.getValueFromObject(bodyParams, 'representative_position'))
            .input('DISPLAYNAME', apiHelper.getValueFromObject(bodyParams, 'display_name'))
            .input('POSTALCODE', apiHelper.getValueFromObject(bodyParams, 'postal_code'))
            .input('LOGOURL', logo_url)
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'account'))
            .input('PASSWORD', password ? stringHelper.hashPassword(password) : null)
            .input('TAXCODE', apiHelper.getValueFromObject(bodyParams, 'tax_code'))
            .input('PAYMENTPERIOD', apiHelper.getValueFromObject(bodyParams, 'payment_period'))
            .execute(PROCEDURE_NAME.MD_SUPPLIER_CREATEORUPDATE);
        const supplierId = data.recordset[0].RESULT;

        //delete old supplier apis
        await pool
            .request()
            .input('LISTID', [supplierId])
            .input('NAMEID', 'SUPPLIERID')
            .input('TABLENAME', 'MD_SUPPLIER_API')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        const supplierApiList = apiHelper.getValueFromObject(bodyParams, 'supplier_api_list', []);
        const l = supplierApiList.length;
        for (let i = 0; i < l; i++) {
            await pool
                .request()
                .input('SUPPLIERAPIID', apiHelper.getValueFromObject(supplierApiList[i], 'supplier_api_id', null))
                .input('SUPPLIERID', supplierId)
                .input('APIURL', apiHelper.getValueFromObject(supplierApiList[i], 'api_url'))
                .input('ACCOUNT', apiHelper.getValueFromObject(supplierApiList[i], 'account', null))
                .input('PASSWORD', apiHelper.getValueFromObject(supplierApiList[i], 'password', null))
                .input('ISDEFAULT', apiHelper.getValueFromObject(supplierApiList[i], 'is_default', 0))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('ISDELETED', 0)
                .execute('MD_SUPPLIER_API_CreateOrUpdate');
        }

        removeCacheOptions();
        return new ServiceResponse(true, '', supplierId);
    } catch (e) {
        logger.error(e, { function: 'supplierService.createOrUpdate' });
        return new ServiceResponse(false);
    }
};

const changeStatusSupplier = async (supplier_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('SUPPLIERID', supplier_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_SUPPLIER_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'supplierService.changeStatusSupplier' });

        return new ServiceResponse(false);
    }
};

const getOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .execute('MD_SUPPLIER_GetOption_AdminWeb');
        const dataOption = supplierClass.option(data.recordset);
        return new ServiceResponse(true, '', dataOption);
    } catch (e) {
        logger.error(e, { function: 'supplierService.getOptions' });
        return new ServiceResponse(false);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_SUPPLIER_OPTIONS);
};

module.exports = {
    getListSupplier,
    deleteSupplier,
    detailSupplier,
    changeStatusSupplier,
    createOrUpdate,
    getOptions,
};
