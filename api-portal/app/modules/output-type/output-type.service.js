const outputTypeClass = require('../output-type/output-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');

const getListOutputType = async (queryParams = {}) => {
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
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('ISVAT', apiHelper.getValueFromObject(queryParams, 'is_vat'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.SL_OUTPUTTYPE_GETLIST);

        const dataRecord = data.recordset;
        let outputTypes = outputTypeClass.list(dataRecord);
        for (const outputtype of outputTypes) {
            outputtype.areas = [];
            // eslint-disable-next-line no-await-in-loop
            const dataArea = await pool
                .request()
                .input('OUTPUTTYPEID', outputtype.output_type_id)
                .execute(PROCEDURE_NAME.SL_OUTPUT_AREA_GETBYOUTPUTTYPE);
            if (dataArea.recordset && dataArea.recordset.length > 0) {
                outputtype.areas = outputTypeClass.listArea(dataArea.recordset);
            }
            outputtype.product_categories = [];
            // eslint-disable-next-line no-await-in-loop
            const dataPriceReviewLVUser = await pool
                .request()
                .input('OUTPUTTYPEID', outputtype.output_type_id)
                .execute(PROCEDURE_NAME.SL_PRICE_REVIEW_LV_USER_GETBYOUTPUTTYPE);
            if (dataPriceReviewLVUser.recordset && dataPriceReviewLVUser.recordset.length > 0) {
                let dataRaw = outputTypeClass.listPriceReviewLVUser(dataPriceReviewLVUser.recordset);
                const dataProductCategories = _.chain(dataRaw)
                    .groupBy('product_category_id')
                    .map((value, key) => ({
                        product_category_id: key,
                        data: value,
                    }))
                    .value();
                for (const value of dataProductCategories) {
                    const product_category = value.data[0];

                    outputtype.product_categories.push({
                        product_category_id: product_category.product_category_id,
                        product_category_name: product_category.product_category_name,
                    });
                }
            }
        }

        return new ServiceResponse(true, '', {
            data: outputTypes,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {
            function: 'OutputTypeService.getListOutputType',
        });
        return new ServiceResponse(false, e.message);
    }
};

const detailOutputType = async (output_type_id, is_child) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OUTPUTTYPEID', output_type_id)
            .execute(PROCEDURE_NAME.SL_OUTPUTTYPE_GETBYID);
        if (data.recordset && data.recordset.length > 0) {
            let outputtype = outputTypeClass.detail(data.recordset[0]);
            if (!is_child) return new ServiceResponse(true, '', outputtype);

            outputtype.product_cate_list = [];
            outputtype.reviews = [];
            outputtype.review_users = {};
            const dataArea = await pool
                .request()
                .input('OUTPUTTYPEID', outputtype.output_type_id)
                .execute(PROCEDURE_NAME.SL_OUTPUT_AREA_GETBYOUTPUTTYPE);
            if (dataArea.recordset && dataArea.recordset.length > 0) {
                outputtype.area_id = outputTypeClass.listArea(dataArea.recordset);
            }
            const dataPriceReviewLVUser = await pool
                .request()
                .input('OUTPUTTYPEID', output_type_id)
                .execute(PROCEDURE_NAME.SL_PRICE_REVIEW_LV_USER_GETBYOUTPUTTYPE);
            if (dataPriceReviewLVUser.recordset && dataPriceReviewLVUser.recordset.length > 0) {
                let dataRaw = outputTypeClass.listPriceReviewLVUser(dataPriceReviewLVUser.recordset);
                // const dataProductCategories = _.chain(dataRaw)
                //     .groupBy("product_category_id")
                //     .map((value, key) => ({
                //         product_category_id: key,
                //         data: value,
                //     }))
                //     .value();
                // for (const value of dataProductCategories) {
                //     const product_category = value.data[0];
                //     product_category.product_category_id &&
                //         outputtype.product_cate_list.push({
                //             product_category_id: product_category.product_category_id,
                //             product_category_name: product_category.product_category_name,
                //             id: product_category.product_category_id,
                //             value: product_category.product_category_id,
                //             label: product_category.product_category_name,
                //         });
                // }

                // const product_category_id = Number(
                //     dataProductCategories[0].product_category_id
                // );
                // dataRaw = _.filter(dataProductCategories[0].data, (item) => {
                //     let isFilter = true;
                //     if (Number(item.product_category_id) !== product_category_id) {
                //         isFilter = false;
                //     }
                //     if (isFilter) {
                //         return item;
                //     }
                //     return null;
                // });

                const dataPriceReviewLevel = _.chain(dataRaw)
                    .groupBy('price_review_level_id')
                    .map((value, key) => ({
                        price_review_level_id: key,
                        data: value,
                    }))
                    .value();

                for (const value of dataPriceReviewLevel) {
                    let price_review_level = value.data[0];
                    price_review_level.users = [];
                    for (const value2 of value.data) {
                        price_review_level.users.push({
                            user_name: value2.user_name,
                            user_full_name: value2.user_full_name,
                            id: value2.user_name,
                            value: value2.user_name,
                            label: value2.user_full_name,
                        });
                    }

                    if (price_review_level?.department_id) {
                        const resUser = await pool
                            .request()
                            .input('DEPARTMENTID', price_review_level?.department_id)
                            .input('PageSize', 100)
                            .input('PageIndex', 1)
                            .execute('SYS_USER_GetList_AdminWeb');

                        let _dataUsers = outputTypeClass.listUser(resUser.recordset);

                        outputtype.review_users[price_review_level?.department_id] = _dataUsers;
                    }

                    price_review_level = removeKeyFromObject(price_review_level, [
                        'user_name',
                        'user_full_name',
                        'product_category_id',
                        'product_category_name',
                        'value',
                        'label',
                    ]);
                    outputtype.reviews.push(price_review_level);
                }
            }

            outputtype.order_types = outputTypeClass.orderTypes(data.recordsets[1]);

            return new ServiceResponse(true, '', outputtype);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'OutputTypeService.detailOutputType',
        });
        return new ServiceResponse(false, e.message);
    }
};

const createOutputTypeOrUpdate = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();
        // Save OutputType
        const requestOutputType = new sql.Request(transaction);
        const resultOutputType = await requestOutputType
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(body, 'output_type_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('AREAID', 0)
            .input('VATID', apiHelper.getValueFromObject(body, 'vat_id') || 0)
            .input('OUTPUTTYPENAME', apiHelper.getValueFromObject(body, 'output_type_name'))
            .input('ISVAT', apiHelper.getValueFromObject(body, 'is_vat'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISOUTPUTFORWEB', apiHelper.getValueFromObject(body, 'is_output_for_web'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.SL_OUTPUTTYPE_CREATEORUPDATE);
        const output_type_id = resultOutputType.recordset[0].RESULT;

        if (output_type_id <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.OUTPUTTYPE.CREATE_FAILED);
        }
        const area_id = apiHelper.getValueFromObject(body, 'area_id');
        //Delete child table
        const requestOutputAreaDel = new sql.Request(transaction);
        const resultOutputAreaDel = await requestOutputAreaDel
            .input('OUTPUTTYPEID', output_type_id)
            .execute(PROCEDURE_NAME.SL_OUTPUT_AREA_DELETEBYOUTPUTTYPEID);
        if (resultOutputAreaDel.recordset[0].RESULT <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.OUTPUTTYPE.CREATE_FAILED);
        }
        //Insert child table
        if (area_id) {
            const requestChild = new sql.Request(transaction);
            const resultChild = await requestChild
                .input('OUTPUTTYPEID', output_type_id)
                .input('AREAID', area_id)
                .execute(PROCEDURE_NAME.SL_OUTPUT_AREA_CREATE);
            const child_id = resultChild.recordset[0].RESULT;
            if (child_id <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.OUTPUTTYPE.CREATE_FAILED);
            }
        }

        //Delete child table
        const requestReviewLVUserDel = new sql.Request(transaction);
        const resultReviewLVUserDel = await requestReviewLVUserDel
            .input('OUTPUTTYPEID', output_type_id)
            .execute(PROCEDURE_NAME.SL_PRICE_REVIEW_LV_USER_DELETEBYOUTPUTTYPEID);
        if (resultReviewLVUserDel.recordset[0].RESULT <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.OUTPUTTYPE.CREATE_FAILED);
        }
        //Insert child table
        for (let i = 0; i < body.price_review_lv_users.length; i++) {
            const item = body.price_review_lv_users[i];

            let user_names = item.users.length ? item.users.map((_user) => _user?.user_name).join('|') : null;
            const requestChild = new sql.Request(transaction);
            const resultChild = await requestChild // eslint-disable-line no-await-in-loop
                .input('OUTPUTTYPEID', output_type_id)
                .input('PRICEEREVIEWLEVELID', apiHelper.getValueFromObject(item, 'price_review_level_id'))
                .input('DEPARTMENTID', apiHelper.getValueFromObject(item, 'department_id'))
                .input('ISAUTOREVIEW', apiHelper.getValueFromObject(item, 'is_auto_reviewed') || 0)
                .input('USERNAMES', user_names)
                // .input(
                //     "PRODUCTCATEGORYIDS",
                //     apiHelper.getValueFromObject(body, "product_categorie_ids")
                // )
                .input('ISCOMPLETEREVIEW', apiHelper.getValueFromObject(item, 'is_completed_reviewed'))
                .execute(PROCEDURE_NAME.SL_PRICE_REVIEW_LV_USER_CREATE);
            const child_id = resultChild.recordset[0].RESULT;

            if (child_id <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.OUTPUTTYPE.CREATE_FAILED);
            }
        }

        //delete output order type
        const deleteRequest = new sql.Request(transaction);
        await deleteRequest
            .input('LISTID', [output_type_id])
            .input('NAMEID', 'OUTPUTTYPEID')
            .input('TABLENAME', 'SL_OUTPUTORDERTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        const order_types = apiHelper.getValueFromObject(body, 'order_types', []);
        const createOrUpdateOutputOrderTypeRequest = new sql.Request(transaction);
        for (let i = 0; i < order_types.length; i++) {
            await createOrUpdateOutputOrderTypeRequest
                .input('OUTPUTTYPEID', output_type_id)
                .input('ORDERTYPEID', order_types[i].value)
                .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute('SL_OUTPUTORDERTYPE_CreateOrUpdate_AdminWeb');
        }

        await transaction.commit();

        return new ServiceResponse(true, '', output_type_id);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'OutputTypeService.createOutputTypeOrUpdate',
        });
        return new ServiceResponse(false, error.message);
    }
};
const changeStatusOutputType = async (output_type_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('OUTPUTTYPEID', output_type_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SL_OUTPUTTYPE_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'OutputTypeService.changeStatusOutputType',
        });
        return new ServiceResponse(false);
    }
};

const deleteOutputType = async (output_type_id, bodyParams) => {
    try {
        console.log(output_type_id);
        const pool = await mssql.pool;
        await pool
            .request()
            .input('OUTPUTTYPEID', output_type_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_OUTPUTTYPE_Delete');

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'OutputTypeService.deleteOutputType',
        });
        return new ServiceResponse(false, e.message);
    }
};
//get option
const getOptionsAll = async function () {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.SL_OUTPUTTYPE_GETOPTIONS);

        return data.recordset;
    } catch (e) {
        logger.error(e, {
            function: 'OutputTypeService.getOptionsAll',
        });
        return [];
    }
};

const getOptions = async (queryParams = {}) => {
    try {
        // Get parameter
        const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
        const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
        const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');

        // Get data from cache
        // const data = await cache.wrap(`${tableName}_OPTIONS`, () => {
        //   return getOptions(tableName);
        // });
        const data = await getOptionsAll();

        // Filter values: empty, null, undefined
        const idsFilter = ids.filter((item) => {
            return item;
        });
        const dataFilter = _.filter(data, (item) => {
            let isFilter = true;
            if (Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
                isFilter = false;
            }
            if (idsFilter.length && !idsFilter.includes(item.ID.toString())) {
                isFilter = false;
            }
            if (parentId && Number(parentId) !== Number(item.PARENTID)) {
                isFilter = false;
            }

            if (isFilter) {
                return item;
            }

            return null;
        });

        return new ServiceResponse(true, '', outputTypeClass.options(dataFilter));
    } catch (e) {
        logger.error(e, {
            function: 'OutputTypeService.getOptions',
        });
        return new ServiceResponse(true, '', []);
    }
};
const removeKeyFromObject = (data = {}, propRemove = []) => {
    return Object.keys(data).reduce((object, key) => {
        if (!propRemove.includes(key)) {
            object[key] = data[key];
        }
        return object;
    }, {});
};
const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.SL_OUTPUTTYPE_OPTIONS);
};
module.exports = {
    getOptions,
    createOutputTypeOrUpdate,
    deleteOutputType,
    changeStatusOutputType,
    detailOutputType,
    getListOutputType,
};
