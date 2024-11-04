const stocksTakeTypeClass = require('./stocks-take-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
const ServiceResponse = require('../../common/responses/service.response');

const getOptionsStocksTakeType = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSTAKETYPE_GetOptions');
        const dataRecord = stocksTakeTypeClass.optionsStocksTakeType(data.recordsets[0]);
        return new ServiceResponse(true, '', dataRecord);
    } catch (e) {
        logger.error(e, { function: 'StocksTakeTypeService.getOptionsStocksTakeType' });
        return new ServiceResponse(false, '', {});
    }
};

const getListStocksTakeType = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('ST_STOCKSTAKETYPE_GetList_AdminWeb');
        const StocksTakeTypes = data.recordsets[0];

        return new ServiceResponse(true, '', {
            data: stocksTakeTypeClass.list(StocksTakeTypes),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(StocksTakeTypes),
        });
    } catch (e) {
        logger.error(e, { function: 'StocksTakeTypeService.getListStocksTakeType' });
        return new ServiceResponse(false, '', {});
    }
};

const detailStocksTakeType = async (stocksTakeTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTAKETYPEID', stocksTakeTypeId)
            .execute('ST_STOCKSTAKETYPE_GetById_AdminWeb');

        let stocks_take_type = stocksTakeTypeClass.detail(data.recordsets[0][0]) || {};
        let reviews = stocksTakeTypeClass.listReviewLevel(data.recordsets[1]) || [];
        let listUser = stocksTakeTypeClass.listReviewUser(data.recordsets[2]) || [];

        reviews = (reviews || []).map((p) => {
            let users = listUser.filter((x) => x.stocks_take_review_level_id == p.stocks_take_review_level_id) || [];
            return {
                ...p,
                users,
            };
        });
        stocks_take_type.stocks_take_review_level_list = reviews;
        let _ids = (reviews || []).map((p) => p.stocks_review_level_id).join(',');
        if (_ids) {
            const resUser = await pool
                .request()
                .input('IDS', _ids)
                .execute('ST_STOCKSINTYPE_GetUserBYReviewLevelId_AdminWeb');

            let _dataUsers = stocksTakeTypeClass.listReviewUser(resUser.recordset);

            let obj = {};
            for (let i = 0; i < _dataUsers.length; i++) {
                let user = _dataUsers[i];
                obj[user.stocks_review_level_id] = [...(obj[user.stocks_review_level_id] || []), user];
            }
            stocks_take_type.review_users = obj;
        }

        return new ServiceResponse(true, '', stocks_take_type);
    } catch (e) {
        logger.error(e, { function: 'stocksTakeTypeService.detailStocksTakeType' });
        return new ServiceResponse(false, e.message);
    }
};

const detailStocksTakeTypeForTake = async (params) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTAKETYPEID', params?.stocksTakeTypeId)
            .input('STOCKSTAKEREQUESTID', params?.stocks_take_request_id)
            .execute(PROCEDURE_NAME.ST_STOCKSTAKETYPE_GETBYID_STOCKSTAKE);
        const list_user = stocksTakeTypeClass.listUserReiew(data.recordsets[2]);
        const stocks_take_review_level_list = stocksTakeTypeClass.listStocksTypeReviewLevel(data.recordsets[1]);
        const res = stocks_take_review_level_list.map((p) => {
            return {
                ...p,
                users: list_user.filter(
                    (_) => parseInt(_.stocks_review_level_id) === parseInt(p?.stocks_review_level_id),
                ),
            };
        });

        return new ServiceResponse(true, '', {
            stocks_take_review_level_list: res,
        });
    } catch (error) {
        console.log(error);
        logger.error(e, { function: 'stocksTakeTypeService.detailStocksTakeTypeV1' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteStocksTakeType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSTAKETYPEIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTAKETYPE_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.STOCKSTAKETYPE.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'StocksTakeTypeService.deleteStocksTakeType' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateStocksTakeType = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const id = apiHelper.getValueFromObject(bodyParams, 'stocks_take_type_id');

        await transaction.begin();

        // Kiểm tra tên hình thức kiểm kê kho có trùng không
        const requestStocksTakeTypeCheck = new sql.Request(transaction);
        const resultStocksTaketypeTypeCheck = await requestStocksTakeTypeCheck
            .input('STOCKTAKETYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_take_type_id'))
            .input('STOCKSTAKETYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_take_type_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSTAKETYPE_CHECKNAME_ADMINWEB);
        if (resultStocksTaketypeTypeCheck.recordset && resultStocksTaketypeTypeCheck.recordset[0].RESULT == 1) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSTAKETYPE.EXISTS_NAME, null);
        }

        // Thêm mới hoặc cập nhật hình thức kiểm kê kho
        const requestStocksTakeTypeCreate = new sql.Request(transaction);
        const data = await requestStocksTakeTypeCreate
            .input('STOCKTAKETYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_take_type_id'))
            .input('STOCKSTAKETYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_take_type_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISSTOCKSTAKEREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_stocks_take_review'))
            .input('ISSTOCKSTAKEIMEICODE', apiHelper.getValueFromObject(bodyParams, 'is_stocks_take_imei_code'))
            .execute(PROCEDURE_NAME.ST_STOCKSTAKETYPE_CREATEORUPDATE_ADMINWEB);
        const stocksTakeTypeId = data.recordset[0].RESULT;
        if (!stocksTakeTypeId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm mới hình thức kiểm kê kho thất bại.');
        }

        // Xóa mức duyệt và người duyệt trước đó nếu là trường hợp cập nhật
        if (id) {
            const requestStocksTakeTypeRLDelete = new sql.Request(transaction);
            const resultStocksTaketypeRLUDelete = await requestStocksTakeTypeRLDelete
                .input('STOCKTAKETYPEID', stocksTakeTypeId)
                .execute(PROCEDURE_NAME.ST_STOCKSTAKETYPE_REVIEWLEVEL_DELETE_ADMINWEB);
            const resultDeleteReviewLevel = resultStocksTaketypeRLUDelete.recordset[0].RESULT;

            if (resultDeleteReviewLevel <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.STOCKSTAKETYPE.UPDATE_FAILED);
            }
            const dataReviewUserDelete = await requestStocksTakeTypeRLDelete
                .input('STOCKTAKETYPEID', stocksTakeTypeId)
                .execute(PROCEDURE_NAME.ST_STOCKSTAKETYPE_RL_USER_DELETE_ADMINWEB);
            const resultDeleteReviewUser = dataReviewUserDelete.recordset[0].RESULT;
            if (resultDeleteReviewUser <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.STOCKSTAKETYPE.UPDATE_FAILED);
            }
        }

        // Thêm thông tin duyệt
        const stocks_take_review_level_list = apiHelper.getValueFromObject(bodyParams, 'stocks_take_review_level_list');
        if (stocks_take_review_level_list && stocks_take_review_level_list.length) {
            const requestStocksTakeTypeRLCreate = new sql.Request(transaction);
            for (let i = 0; i < stocks_take_review_level_list.length; i++) {
                const { stocks_review_level_id, users, is_auto_reviewed, is_completed_reviewed } =
                    stocks_take_review_level_list[i];
                // Thêm mức duyệt
                const dataReviewLevelCreate = await requestStocksTakeTypeRLCreate
                    .input('STOCKSTAKETYPEID', stocksTakeTypeId)
                    .input('STOCKSREVIEWLEVELID', stocks_review_level_id)
                    .input('ISAUTOREVIEWED', is_auto_reviewed)
                    .input('ISCOMPLETEDREVIEWED', is_completed_reviewed)
                    .input('REVIEWORDERINDEX', i)
                    .execute('ST_STOCKSTAKETYPE_REVIEWLEVEL_CreateOrUpdate_AdminWeb');
                const resultReviewLevelCreate = dataReviewLevelCreate.recordset[0].RESULT;
                if (!resultReviewLevelCreate) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới mức duyệt cho hình thức kiểm kê kho thất bại.');
                }

                if (users && users.length && !is_auto_reviewed) {
                    const requestStocksTakeTypeRLUCreate = new sql.Request(transaction);
                    for (let j = 0; j < users.length; j++) {
                        // Thêm thông tin người duyệt
                        const { value, department_id } = users[j];
                        const dataReviewLevelUserCreate = await requestStocksTakeTypeRLUCreate
                            .input('STOCKSTAKETYPEID', stocksTakeTypeId)
                            .input('DEPARTMENTID', department_id)
                            .input('USERNAME', value)
                            .input('STOCKSREVIEWLEVELID', stocks_review_level_id)
                            .execute('ST_STOCKSTAKETYPE_RL_USER_CreateOrUpdate_AdminWeb');
                        const resultReviewLevelUserCreate = dataReviewLevelUserCreate.recordset[0].RESULT;
                        if (!resultReviewLevelUserCreate) {
                            await transaction.rollback();
                            return new ServiceResponse(
                                false,
                                'Thêm mới thông tin duyệt cho hình thức kiểm kê kho thất bại.',
                            );
                        }
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'update success', stocksTakeTypeId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'stocksTakeTypeService.createOrUpdateStocksTakeType' });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSTAKETYPE.CREATE_FAILED);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

// export Excel
const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    queryParams.is_active = 2;
    const serviceRes = await getListstocksTakeType(queryParams);
    const { data } = serviceRes.getData();

    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();
    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('List stocksTakeType', {});
    // Set width
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    ws.column(12).setWidth(50);
    ws.column(13).setWidth(50);

    const header = {
        stocks_out_type_id: 'Mã chức vụ',
        stocks_out_type_name: 'Tên chức vụ',
        created_user: 'Người tạo',
        created_date: 'Ngày tạo',
        is_active: 'Kích hoạt',
    };
    data.unshift(header);

    data.forEach((item, index) => {
        let indexRow = index + 1;
        let indexCol = 0;
        ws.cell(indexRow, ++indexCol).string(item.stocks_out_type_id.toString());
        ws.cell(indexRow, ++indexCol).string((item.stocks_out_type_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.created_user || '').toString());
        ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Có' : 'Không');
        ws.cell(indexRow, ++indexCol).string((item.created_date || '').toString());
    });
    return new ServiceResponse(true, '', wb);
};

const getOptionsReviewLevel = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTYPE', apiHelper.getValueFromObject(queryParams, 'stocks_type'))
            .execute('ST_STOCKSREVIEWLEVEL_GetOption_AdminWeb');
        let stocksTake = stocksTakeTypeClass.options(data.recordset);
        return new ServiceResponse(true, '', stocksTake);
    } catch (e) {
        logger.error(e, { function: 'stocksTakeType.getOptionsReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const getListUserReview = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(queryParams, 'stocks_review_level_id'))
            .execute('ST_STOCKSREVIEWLEVEL_GetUserReview_AdminWeb');
        let userReview = stocksTakeTypeClass.options(data.recordset);

        return new ServiceResponse(true, '', userReview);
    } catch (e) {
        logger.error(e, { function: 'stocksTakeType.getListUserReview' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocksTakeType,
    detailStocksTakeType,
    detailStocksTakeTypeForTake,
    deleteStocksTakeType,
    createOrUpdateStocksTakeType,
    exportExcel,
    getListUserReview,
    getOptionsReviewLevel,
    getOptionsStocksTakeType,
};
