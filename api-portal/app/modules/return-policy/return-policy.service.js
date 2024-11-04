const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const returnPolicyClass = require('./return-policy.class');
const optionService = require('../../common/services/options.service');
const { toSQLDateTime } = require('./helper/date.helper');

const getReturnPolicyList = async (queryParams = {}) => {
    try {
        const category_id_search = apiHelper.getValueFromObject(queryParams, 'category_id_search');

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('PRODUCTCATEGORYID', parseInt(category_id_search))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id_search'))
            .input('STARTDATE', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('PRO_RETURNPOLICY_GetList_AdminWeb');

        const returnPolicyData = returnPolicyClass.list(data.recordsets[0]);

        return new ServiceResponse(true, '', {
            data: returnPolicyData,
            page: currentPage,
            limit: itemsPerPage,
            total: data.recordsets[1][0].TOTALITEMS,
        });
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.getReturnPolicyList' });
        return new ServiceResponse(false, '', {});
    }
};

const getProductCategoryByReturnPolicyId = async (rp_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('RETURNPOLICYID', rp_id)
            .execute('PRO_RETURNPOLICY_GetCategoryByReturnPolicyId_AdminWeb');
        return new ServiceResponse(true, '', returnPolicyClass.listCategory(data.recordsets[0]));
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.getReturnPolicyList' });
        return new ServiceResponse(false, '', {});
    }
};

const createOrUpdateReturnPolicy = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const start_date = toSQLDateTime(apiHelper.getValueFromObject(bodyParams, 'start_date', ''));
        let end_date = apiHelper.getValueFromObject(bodyParams, 'end_date');
        if (end_date) {
            end_date = toSQLDateTime(end_date);
        }

        await transaction.begin();
        const returnPolicyId = apiHelper.getValueFromObject(bodyParams, 'return_policy_id');
        const label = returnPolicyId ? 'Cập nhật' : 'Tạo';
        const isApplyAllCustomerType = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_customer_type', 0);
        const isApplyAllCategory = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_category', 0);
        const returnPolicyReq = new sql.Request(transaction);
        const returnPolicyData = await returnPolicyReq
            .input('RETURNPOLICYID', returnPolicyId)
            .input('RETURNPOLICYNAME', apiHelper.getValueFromObject(bodyParams, 'return_policy_name'))
            .input('RETURNPOLICYCODE', apiHelper.getValueFromObject(bodyParams, 'return_policy_code'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISRETURN', apiHelper.getValueFromObject(bodyParams, 'is_return', 0))
            .input('ISEXCHANGE', apiHelper.getValueFromObject(bodyParams, 'is_exchange', 0))
            .input('ISCASHBACK', apiHelper.getValueFromObject(bodyParams, 'is_cashback', 0))
            .input('ISDEPRECIATION', apiHelper.getValueFromObject(bodyParams, 'is_depreciation', 0))
            .input('PERCENTVALUE', apiHelper.getValueFromObject(bodyParams, 'percent_value', 0))
            .input('ISAPPLYALLCATEGORY', isApplyAllCategory)
            .input('ISAPPLYALLCUSTOMERTYPE', isApplyAllCustomerType)
            .input('ISAPPLYDISCOUNTORDER', apiHelper.getValueFromObject(bodyParams, 'is_apply_discount_order', 0))
            .input('ISAPPLYDISCOUNTPRODUCT', apiHelper.getValueFromObject(bodyParams, 'is_apply_discount_product', 0))
            .input(
                'ISEXCHANGELOWERPRICEPRODUCT',
                apiHelper.getValueFromObject(bodyParams, 'is_exchange_lower_price_product', 0),
            )
            .input('ISOTHERCONDITION', apiHelper.getValueFromObject(bodyParams, 'is_other_condition', 0))
            .input('NUMBERRETURNDAY', apiHelper.getValueFromObject(bodyParams, 'number_return_day'))
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 0))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('PRO_RETURNPOLICY_CreateOrUpdate_AdminWeb');
        const returnPolicyCreatedId = returnPolicyData.recordset[0].id;
        if (!returnPolicyCreatedId || returnPolicyCreatedId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, `${label} chính sách thất bại`);
        }

        let tables = [
            {
                name: 'CONDITION',
                end_point_column_id_custom: 'RETURNCONDITION',
            },
            {
                name: 'CUSTOMERTYPE',
            },
            {
                name: 'CATEGORY',
                end_point_pk_custom: 'CATE',
                end_point_column_id_custom: 'PRODUCTCATEGORY',
            },
            {
                name: 'PRODUCT',
            },
        ];

        // Delete table map before update
        const list_id_remove = apiHelper.getValueFromObject(bodyParams, `list_id_remove`);
        if (returnPolicyId && list_id_remove) {
            for (const table of tables) {
                const data = await removeTableMap(
                    table.name,
                    list_id_remove[`return_policy_${table.name.toLowerCase()}_ids`],
                );
                if (data.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(false, data.message);
                }
            }
        }

        // Remove CONDITION
        if (isApplyAllCustomerType) {
            tables = tables.filter((item) => item.name !== 'CUSTOMERTYPE');
        }

        // Remove CATEGORY and PRODUCT
        if (isApplyAllCategory) {
            tables = tables.filter((item) => item.name !== 'CATEGORY' && item.name !== 'PRODUCT');
        }
        bodyParams.return_policy_id = returnPolicyId ?? returnPolicyCreatedId;
        for (const table of tables) {
            const reqReturnPolicyAnd = new sql.Request(transaction);
            const nameTable = table.name.toLowerCase();
            const tableIds = apiHelper.getValueFromObject(bodyParams, `${nameTable}_ids`);
            if (tableIds.length === 0) continue;
            for (const tableId of tableIds) {
                if (table.end_point_column_id_custom) {
                    bodyParams[`${table.end_point_column_id_custom.toLowerCase()}_id`] = tableId;
                } else {
                    bodyParams[`${nameTable}_id`] = tableId;
                }
                const data = await createOrUpdateReturnPolicyAnd(table, bodyParams, reqReturnPolicyAnd);
                if (data.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(false, data.message);
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, `${label} chính sách thành công`);
    } catch (error) {
        logger.error(error, { ReturnPolicy: 'returnPolicyService.createOrUpdateReturnPolicy' });
        return new ServiceResponse(false, error.message);
    }
};

const removeTableMap = async (nameTable, list_id = []) => {
    const pool = await mssql.pool;
    const resData = await pool;
    try {
        const data = await resData
            .request()
            .input(`LISTID`, list_id.join(','))
            .execute(`PRO_RETURNPOLICY_${nameTable.toUpperCase()}_DeleteMany_AdminWeb`);
        return new ServiceResponse(true, `Xóa thành công`);
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.removeTableMap' });
        return new ServiceResponse(false, '');
    }
};

const createOrUpdateReturnPolicyAnd = async (table, bodyParams = {}, requestTransaction) => {
    const nameTable = table.name.toUpperCase();
    const end_point_pk_custom = table.end_point_pk_custom?.toUpperCase();
    const end_point_column_id_custom = table.end_point_column_id_custom?.toUpperCase();
    try {
        const resCreateOrUpdateReturnPolicy = await requestTransaction
            .input(
                `RETURNPOLICY${end_point_pk_custom ?? nameTable}ID`,
                apiHelper.getValueFromObject(
                    bodyParams,
                    `return_policy_${(end_point_pk_custom ?? nameTable).toLowerCase()}_id`,
                ),
            )
            .input(
                `${end_point_column_id_custom ?? nameTable}ID`,
                apiHelper.getValueFromObject(
                    bodyParams,
                    `${(end_point_column_id_custom ?? nameTable).toLowerCase()}_id`,
                ),
            )
            .input('RETURNPOLICYID', apiHelper.getValueFromObject(bodyParams, 'return_policy_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(`PRO_RETURNPOLICY_${nameTable}_Create_AdminWeb`);
        const returnPolicyId = resCreateOrUpdateReturnPolicy.recordset[0].id;
        if (!returnPolicyId || returnPolicyId <= 0) {
            return new ServiceResponse(false, `Tạo thất bại`);
        }
        removeCacheOptions();
        return new ServiceResponse(true, `Tạo thành công`);
    } catch (error) {
        logger.error(error, { ReturnPolicy: 'returnPolicyService.createOrUpdateReturnPolicyAnd' });
        return new ServiceResponse(false, error.message);
    }
};

const returnPolicyDetail = async (returnPolicyId) => {
    try {
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('RETURNPOLICYID', returnPolicyId)
            .execute('PRO_RETURNPOLICY_GetById_AdminWeb');

        const returnPolicy = resData.recordsets[0];
        if (!returnPolicy) return new ServiceResponse(false, 'Lấy chi tiết chính sách thất bại');

        const returnPolicyData = returnPolicyClass.detail(returnPolicy);
        const data = [];
        const tables = ['condition', 'customertype', 'category', 'product'];
        for (let item of returnPolicyData) {
            item = {
                ...item,
                condition_ids: [
                    {
                        return_condition_id: item.return_condition_id,
                        return_policy_condition_id: item.return_policy_condition_id,
                        return_condition_name: item.return_condition_name,
                    },
                ],
                customertype_ids: [
                    {
                        customertype_id: item.customer_type_id,
                        return_policy_customertype_id: item.return_policy_customer_type_id,
                    },
                ],
                category_ids: [
                    {
                        category_id: item.product_category_id,
                        return_policy_category_id: item.return_policy_category_id,
                        parent_name: item.parent_name,
                        category_name: item.category_name,
                    },
                ],
                product_ids: [
                    {
                        product_id: +item.product_id,
                        return_policy_product_id: item.return_policy_product_id,
                        product_name: item.product_name,
                        product_code: item.product_code,
                        category_name: item.category_name,
                    },
                ],
            };

            const match = data.find((r) => r.return_policy_id === item.return_policy_id);
            if (match) {
                for (const table of tables) {
                    if (
                        !match[`${table}_ids`].find((i) => i[`${table}_id`] === item[`${table}_ids`][0][`${table}_id`])
                    ) {
                        match[`${table}_ids`] = match[`${table}_ids`].concat(item[`${table}_ids`]);
                    }
                }
            } else {
                data.push(item);
            }
        }

        const {
            return_condition_id,
            customer_type_id,
            product_category_id,
            product_id,
            return_policy_condition_id,
            return_policy_customer_type_id,
            return_policy_category_id,
            return_policy_product_id,
            return_condition_name,
            parent_name,
            product_name,
            ...result
        } = data[0];

        if (result.is_apply_all_customer_type) result.customertype_ids = [];
        if (result.is_apply_all_category) {
            result.category_ids = [];
            result.product_ids = [];
        }

        return new ServiceResponse(true, 'Lấy chi tiết chính sách thành công', result);
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.returnPolicyDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteReturnPolicy = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id', []))
            .input('NAMEID', 'RETURNPOLICYID')
            .input('TABLENAME', 'PRO_RETURNPOLICY')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.deleteReturnPolicy' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.PRO_RETURNPOLICY_OPTIONS);
};

const getConditionList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('TYPEPOLICY', apiHelper.getValueFromObject(queryParams, 'type_policy'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(queryParams, 'is_system'))
            .execute('PRO_RETURNCONDITION_GetListByTypePolicy_AdminWeb');

        return new ServiceResponse(true, '', {
            data: returnPolicyClass.listCondition(data.recordsets[0]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.getReturnPolicyList' });
        return new ServiceResponse(true, '', {});
    }
};

const getCustomerTypeOptions = async (queryParams = {}) => {
    try {
        const serviceRes = await optionService('CRM_CUSTOMERTYPE', queryParams);
        return new ServiceResponse(true, 'Lấy danh sách loại khách hàng thành công', serviceRes.getData());
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.getCustomerTypeOptions' });
        return new ServiceResponse(true, '', {});
    }
};

const getProductCategoryList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_PRODUCTCATEGORY_GetList_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: returnPolicyClass.listProductCategory(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (e) {
        logger.error(e, { function: 'returnPolicyService.getProductCategoryList' });
        return new ServiceResponse(true, '', {});
    }
};

const getProductList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('PRODUCTCATEGORYIDS', apiHelper.getValueFromObject(queryParams, 'category_ids')?.join(','))
            .input('PRODUCTMODELID', apiHelper.getValueFromObject(queryParams, 'product_model_id'))
            .input('ISACTIVE', Number(apiHelper.getFilterBoolean(queryParams, 'is_active')))
            .execute('MD_PRODUCT_GetListByCategoryIds_AdminWeb');

        return new ServiceResponse(true, '', {
            data: returnPolicyClass.listProduct(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'returnPolicyService.getProductList',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getCategoryOptions = async (queryParams = {}) => {
    try {
        const serviceRes = await optionService('MD_PRODUCTCATEGORY_OPTS', queryParams);
        return new ServiceResponse(true, '', serviceRes.getData());
    } catch (error) {
        return new ServiceResponse(false, error.message);
    }
};

const getProductOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'category_id', 0))
            .execute('MD_PRODUCT_GetProductsByCategoryId_AdminWeb');
        return new ServiceResponse(true, '', returnPolicyClass.productOptions(data.recordset));
    } catch (error) {
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    createOrUpdateReturnPolicy,
    returnPolicyDetail,
    getConditionList,
    getCustomerTypeOptions,
    getProductCategoryList,
    getProductList,
    getReturnPolicyList,
    deleteReturnPolicy,
    getCategoryOptions,
    getProductOptions,
};
