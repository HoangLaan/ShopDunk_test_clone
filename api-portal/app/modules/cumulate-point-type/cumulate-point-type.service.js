const cumulatePointTypeClass = require('./cumulate-point-type.class');
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
            .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINTTYPE_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            list: cumulatePointTypeClass.list(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
            page: page,
            itemsPerPage: itemsPerPage,
        });
    } catch (error) {
        logger.error(error, { function: 'AccumulatePointTypeService.getList' });
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

        return new ServiceResponse(true, '', cumulatePointTypeClass.listStore(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'AccumulatePointTypeService.getListStore' });
        return new ServiceResponse(false, error, []);
    }
};

const createOrUpdate = async (id = null, body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const requestProposal = new sql.Request(transaction);
        const res = await requestProposal
            .input('ACPOINTID', id)
            .input('ACPOINTNAME', apiHelper.getValueFromObject(body, 'ac_point_name'))
            .input('VALUE', apiHelper.getValueFromObject(body, 'value'))
            .input('POINT', apiHelper.getValueFromObject(body, 'point'))
            .input('ISALLMEMBERTYPE', apiHelper.getValueFromObject(body, 'is_all_member_type'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('ISAPPLYALLCATEGORY', apiHelper.getValueFromObject(body, 'is_apply_all_category'))
            .input('POINTAFFMEMBER', apiHelper.getValueFromObject(body, 'point_aff_member'))
            .input('POINTREFERRED', apiHelper.getValueFromObject(body, 'point_referred'))
            .input('ISAPPLYCONDITION', apiHelper.getValueFromObject(body, 'is_apply_condition'))
            .input('EFFECTIVEDATEFROM', apiHelper.getValueFromObject(body, 'effective_date_from'))
            .input('EFFECTIVEDATETO', apiHelper.getValueFromObject(body, 'effective_date_to'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system', API_CONST.ISSYSTEM.ALL))
            .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINTTYPE_CREATEORUPDATE_ADMINWEB);
        let result = apiHelper.getResult(res.recordset);
        if (!result) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
        }
        //
        if (id) {
            const requestDeleteCondition = new sql.Request(transaction);
            const resDeleteCondition = await requestDeleteCondition
                .input('ACPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_ACCUMULATETYPE_CONDITION_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteCondition.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
            }

            const requestDeleteStore = new sql.Request(transaction);
            const resDeleteStore = await requestDeleteStore
                .input('ACPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_STORE_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteStore.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
            }

            const requestDeleteProductCategory = new sql.Request(transaction);
            const resDeleteProductCategory = await requestDeleteProductCategory
                .input('ACPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_PRODUCTCATEGORY_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteProductCategory.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
            }

            const requestDeleteProduct = new sql.Request(transaction);
            const resDeleteProduct = await requestDeleteProduct
                .input('ACPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_PRODUCT_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteProduct.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
            }

            const requestDeleteCustomerType = new sql.Request(transaction);
            const resDeleteCustomerType = await requestDeleteCustomerType
                .input('ACPOINTID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_CUSTOMERTYPE_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteCustomerType.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
            }
        }

        //Danh sách điều kiện tích điểm
        const list_condition = apiHelper.getValueFromObject(body, 'list_condition', []);
        if (list_condition?.length > 0) {
            for (let index = 0; index < list_condition.length; index++) {
                const element = list_condition[index];
                const requestCreateOrUpdateCondition = new sql.Request(transaction);
                const resCreateOrUpdateCondition = await requestCreateOrUpdateCondition
                    .input('ACPOINTCONDITIONID', apiHelper.getValueFromObject(element, 'ac_point_condition_id'))
                    .input('ACPOINTID', result)
                    .input('ORDERVALUEFROM', apiHelper.getValueFromObject(element, 'order_value_from'))
                    .input('ORDERVALUETO', apiHelper.getValueFromObject(element, 'order_value_to'))
                    .input('POINTAFFMEMBER', apiHelper.getValueFromObject(element, 'point_aff_member'))
                    .input('POINTREFERRED', apiHelper.getValueFromObject(element, 'point_referred'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_ACCUMULATETYPE_CONDITION_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateCondition.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
                }
            }
        }

        //Danh sách cửa hàng áp dụng
        const list_store = apiHelper.getValueFromObject(body, 'list_store', []);
        if (list_store?.length > 0) {
            for (let index = 0; index < list_store.length; index++) {
                const element = list_store[index];
                const requestCreateOrUpdateStore = new sql.Request(transaction);
                const resCreateOrUpdateStore = await requestCreateOrUpdateStore
                    .input('ACPOINTSTOREID', apiHelper.getValueFromObject(element, 'ac_point_store_id'))
                    .input('ACPOINTID', result)
                    .input('STOREID', apiHelper.getValueFromObject(element, 'store_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_STORE_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateStore.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
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
                        'ACPOINTPRODUCTCATEGORYID',
                        apiHelper.getValueFromObject(element, 'ac_point_product_category_id'),
                    )
                    .input('ACPOINTID', result)
                    .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(element, 'product_category_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(element, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_PRODUCTCATEGORY_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateProductCategory.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
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
                    .input('ACPOINTPRODUCTID', apiHelper.getValueFromObject(element, 'ac_point_product_id'))
                    .input('ACPOINTID', result)
                    .input('PRODUCTID', apiHelper.getValueFromObject(element, 'product_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(element, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_PRODUCT_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateProduct.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
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
                    .input('ACPOINTCUSTOMERTYPEID', apiHelper.getValueFromObject(element, 'ac_point_customer_type_id'))
                    .input('ACPOINTID', result)
                    .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(element, 'customer_type_id'))
                    .input('COMPANYID', apiHelper.getValueFromObject(element, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINT_CUSTOMERTYPE_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateProduct.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tích điểm');
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'AccumulatePointTypeService.createOrUpdate' });
        return new ServiceResponse(false, error);
    }
};

const detail = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('ACPOINTID', apiHelper.getValueFromObject(params, 'id'))
            .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINTTYPE_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', {
            ...cumulatePointTypeClass.detail(res.recordsets[0]?.[0]),
            list_store: cumulatePointTypeClass.listStore(res.recordsets[1]),
            list_condition: cumulatePointTypeClass.listCondition(res.recordsets[2]),
            list_customer_type: cumulatePointTypeClass.listCustomerType(res.recordsets[3]),
            list_product: cumulatePointTypeClass.listProduct(res.recordsets[4]),
            list_product_category: cumulatePointTypeClass.listProductCategory(res.recordsets[5]),
        });
    } catch (error) {
        logger.error(error, { function: 'AccumulatePointTypeService.detail' });
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
                .input('ACPOINTID', element)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.PT_ACCUMULATEPOINTTYPE_DELETE_ADMINWEB);
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
        logger.error(e, { function: 'AccumulatePointTypeService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.PT_ACCUMULATEPOINTTYPE_OPTIONS);
};

const getListOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PRODUCTIDS', apiHelper.getValueFromObject(params, 'product_ids'))
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(params, 'customer_type_id'))
            .execute('PT_ACCUMULATEPOINTTYPE_GetOPtions_AdminWeb');

        return new ServiceResponse(true, '', cumulatePointTypeClass.listOptions(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'AccumulatePointTypeService.getListOptions' });
        return new ServiceResponse(false, error, []);
    }
};

const calculatePoint = async (params = {}) => {
    try {
        const acpointId = apiHelper.getValueFromObject(params, 'acpoint_id');
        const totalMoney = apiHelper.getValueFromObject(params, 'total_money');
        const presenter = apiHelper.getValueFromObject(params, 'presenter');

        const accumulateDetail = await detail({ id: acpointId });
        if (accumulateDetail.isSuccess()) {
            const data = accumulateDetail.getData();
            let customer_point = Math.floor(Number(totalMoney) / Number(data.value)) * Number(data.point);
            let presenter_point = 0;

            if (presenter) {
                let point_aff_member = data?.point_aff_member || 0;
                let point_referred = data?.point_referred || 0;

                if (data.is_apply_condition) {
                    data.list_condition?.forEach(
                        (condition) => {
                            if (totalMoney >= condition.order_value_from && totalMoney <= condition.order_value_to) {
                                point_aff_member += condition.point_aff_member || 0;
                                point_referred += condition.point_referred || 0;
                            }
                        },
                        { presenter_point: 0, customer_point: 0 },
                    );
                }

                presenter_point = Number(point_aff_member || 0);
                customer_point += Number(point_referred || 0);
            }

            return new ServiceResponse(true, '', {
                customer_point,
                presenter_point,
            });
        }

        return new ServiceResponse(true, '', 0);
    } catch (error) {
        logger.error(error, { function: 'AccumulatePointTypeService.calculatePoint' });
        return new ServiceResponse(false, error, []);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    getListStore,
    getListOptions,
    calculatePoint,
};
