const exchangePointClass = require('./exchange-point.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const getList = async (params = {}) => {
    try {
        const page = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            list: exchangePointClass.list(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
            page: page,
            itemsPerPage: itemsPerPage,
        });
    } catch (error) {
        logger.error(error, { function: 'ExchangePointService.getList' });
        return new ServiceResponse(false, error, []);
    }
};

const getListStore = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('AREAID', apiHelper.getValueFromObject(params, 'area_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(params, 'business_id'))
            .input('CLUSTERID', apiHelper.getValueFromObject(params, 'cluster_id'))
            .execute(PROCEDURE_NAME.MD_STORE_GETALL_ADMINWEB);

        return new ServiceResponse(true, '', exchangePointClass.listStore(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'ExchangePointService.getListStore' });
        return new ServiceResponse(false, error, []);
    }
};

const createOrUpdate = async (id = null, body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const requestExchangePoint = new sql.Request(transaction);
        const res = await requestExchangePoint
            .input('EXPOINTID', id)
            .input('EXPOINTNAME', apiHelper.getValueFromObject(body, 'ex_point_name'))
            .input('VALUE', apiHelper.getValueFromObject(body, 'value'))
            .input('POINT', apiHelper.getValueFromObject(body, 'point'))
            .input('ISALLMEMBERTYPE', apiHelper.getValueFromObject(body, 'is_all_member_type'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('ISAPPLYALLCATEGORY', apiHelper.getValueFromObject(body, 'is_apply_all_category'))
            .input('ISEXCHANGEPOINTTOMONEY', apiHelper.getValueFromObject(body, 'is_exchange_point_to_money'))
            .input('MAXEXPOINT', apiHelper.getValueFromObject(body, 'max_ex_point'))
            .input('APPLIEDAFTER', apiHelper.getValueFromObject(body, 'applied_after'))
            .input('APPLIEDDATEFROM', apiHelper.getValueFromObject(body, 'applied_date_from'))
            .input('APPLIEDDATETO', apiHelper.getValueFromObject(body, 'applied_date_to'))
            .input('ISAPPLYWEBSITE', apiHelper.getValueFromObject(body, 'is_apply_website'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system', API_CONST.ISSYSTEM.ALL))
            .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_CREATEORUPDATE_ADMINWEB);
        let result = apiHelper.getResult(res.recordset);
        if (!result) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
        }
        //
        if (id) {
            const requestDeleteStore = new sql.Request(transaction);
            const resDeleteStore = await requestDeleteStore
                .input('EXPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_STORE_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteStore.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
            }

            const requestDeleteProductCategory = new sql.Request(transaction);
            const resDeleteProductCategory = await requestDeleteProductCategory
                .input('EXPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_PRODUCTCATEGORY_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteProductCategory.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
            }

            const requestDeleteProduct = new sql.Request(transaction);
            const resDeleteProduct = await requestDeleteProduct
                .input('EXPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_PRODUCT_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteProduct.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
            }

            const requestDeleteCustomerType = new sql.Request(transaction);
            const resDeleteCustomerType = await requestDeleteCustomerType
                .input('EXPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_CUSTOMERTYPE_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteCustomerType.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
            }
        }

        //Danh sách cửa hàng áp dụng
        const list_store = apiHelper.getValueFromObject(body, 'list_store', []);
        if (list_store?.length > 0) {
            for (let index = 0; index < list_store.length; index++) {
                const element = list_store[index];
                const requestCreateOrUpdateStore = new sql.Request(transaction);
                const resCreateOrUpdateStore = await requestCreateOrUpdateStore
                    .input('EXPOINTSTOREID', apiHelper.getValueFromObject(element, 'ex_point_store_id'))
                    .input('EXPOINTID', result)
                    .input('STOREID', apiHelper.getValueFromObject(element, 'store_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_STORE_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateStore.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
                }
            }
        }

        //Danh sách ngành hàng áp dụng
        const list_product_category = apiHelper.getValueFromObject(body, 'list_product_category', []);
        if (list_product_category?.length > 0) {
            for (let index = 0; index < list_product_category.length; index++) {
                const element = list_product_category[index];
                const requestCreateOrUpdateProductCategory = new sql.Request(transaction);
                const resCreateOrUpdateProductCategory = await requestCreateOrUpdateProductCategory
                    .input(
                        'EXPOINTPRODUCTCATEGORYID',
                        apiHelper.getValueFromObject(element, 'ex_point_product_category_id'),
                    )
                    .input('EXPOINTID', result)
                    .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(element, 'product_category_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(element, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_PRODUCTCATEGORY_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateProductCategory.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
                }
            }
        }

        //Danh sách sản phẩm áp dụng
        const list_product = apiHelper.getValueFromObject(body, 'list_product', []);
        if (list_product?.length > 0) {
            for (let index = 0; index < list_product.length; index++) {
                const element = list_product[index];
                const requestCreateOrUpdateProduct = new sql.Request(transaction);
                const resCreateOrUpdateProduct = await requestCreateOrUpdateProduct
                    .input('EXPOINTPRODUCTID', apiHelper.getValueFromObject(element, 'ex_point_product_id'))
                    .input('EXPOINTID', result)
                    .input('PRODUCTID', apiHelper.getValueFromObject(element, 'product_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(element, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_PRODUCT_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateProduct.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
                }
            }
        }

        //Danh sách loại khách hàng áp dụng (hạng khách hàng)
        const list_customer_type = apiHelper.getValueFromObject(body, 'list_customer_type', []);
        if (list_customer_type?.length > 0) {
            for (let index = 0; index < list_customer_type.length; index++) {
                const element = list_customer_type[index];
                const requestCreateOrUpdateProduct = new sql.Request(transaction);
                const resCreateOrUpdateProduct = await requestCreateOrUpdateProduct
                    .input('EXPOINTCUSTOMERTYPEID', apiHelper.getValueFromObject(element, 'ex_point_customer_type_id'))
                    .input('EXPOINTID', result)
                    .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(element, 'customer_type_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(element, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_CUSTOMERTYPE_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateProduct.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tiêu điểm');
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'ExchangePointService.createOrUpdate' });
        return new ServiceResponse(false, error);
    }
};

const detail = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('EXPOINTID', apiHelper.getValueFromObject(params, 'id'))
            .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', {
            ...exchangePointClass.detail(res.recordsets[0]?.[0]),
            list_store: exchangePointClass.listStore(res.recordsets[1]),
            list_customer_type: exchangePointClass.listCustomerType(res.recordsets[2]),
            list_product: exchangePointClass.listProduct(res.recordsets[3]),
            list_product_category: exchangePointClass.listProductCategory(res.recordsets[4]),
        });
    } catch (error) {
        logger.error(error, { function: 'ExchangePointService.detail' });
        return new ServiceResponse(false, error);
    }
};

const remove = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        for (let element of list_id) {
            const requestDelete = new sql.Request(transaction);
            const resDelete = await requestDelete
                .input('EXPOINTID', element)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_DELETE_ADMINWEB);
            if (!apiHelper.getResult(resDelete.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false);
            }
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.PT_EXCHANGEPOINT_OPTIONS);
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    getListStore,
};
