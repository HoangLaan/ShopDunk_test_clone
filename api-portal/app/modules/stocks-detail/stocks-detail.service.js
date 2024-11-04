const stocksDetailClass = require('../stocks-detail/stocks-detail.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
let xl = require('excel4node');
const { convertUnitDensity } = require('../../common/helpers/stock.helper');
const moment = require('moment');
const _ = require('lodash');
const sql = require('mssql');
const { CALCULATE_METHODS } = require('./constants');
const { calTotalQuantity, findCogs, arrayToString, keysConfigMapping } = require('./utils/helper');
const indexOf = (array, unit, value) => {
    return array.findIndex((el) => el[value] === unit);
}; // Tìm vị trí của phần tử trùng nhau

// Gôm các giá trị có cùng mã sản phẩm
const handleMergeData = (arr) => {
    const res = [];
    let listTag = [];

    for (let i = 0; i < arr.length; i++) {
        const ind = indexOf(res, arr[i].product_id, 'product_id');
        if (ind !== -1) {
            res[ind].total_in += arr[i].total_in;
            res[ind].total_out += arr[i].total_out || 0;
            res[ind].total_inventory += arr[i].total_inventory;
        } else {
            res.push(arr[i]);
        }
    }
    return res;
};

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStocksDetail = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'category_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
            .input('MATERIALID', apiHelper.getValueFromObject(queryParams, 'material_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ISOUTOFSTOCK', apiHelper.getValueFromObject(queryParams, 'is_out_of_stock'))
            .input('PERIOD', apiHelper.getValueFromObject(queryParams, 'period'))
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('AUTHNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('INVENTORYSTATUS', apiHelper.getValueFromObject(queryParams, 'inventory_status'))
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETLIST_ADMINWEB);
        const StocksDetails = data.recordsets[0];
        let result = stocksDetailClass.list(StocksDetails);
        // result = handleMergeData(result);

        return new ServiceResponse(true, '', {
            data: result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset), //data.recordset[0].TOTALITEMS,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListStocksDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const detailStocksDetail = async (stocksId, queryParams) => {
    try {
        const { product_id } = queryParams;
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', stocksId)
            .input('PRODUCTID', product_id)
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETBYID_ADMINWEB);

        // If exists
        if (data.recordset && data.recordset.length > 0) {
            let stocksDetail = stocksDetailClass.detail(data.recordset[0]);
            // lay danh sach don vi nhap kho cua san pham
            stocksDetail.units = stocksDetailClass.listUnit(data.recordsets[1]);
            return new ServiceResponse(true, '', stocksDetail);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListProductHoldingConfig' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete stocksReviewLevel
const deleteStocksDetail = async (stocksProductHoldingId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKPRODUCTHOLDINGID', stocksProductHoldingId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_DELETE_STOCKSHOLDING_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.STOCKS_DETAIL.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.deleteStocksDetail' });
        return new ServiceResponse(false, e.message);
    }
};

// change Status StocksDetail
const changeStatusStocksDetail = async (stocksReviewLevelId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSREVIEWLEVELID', stocksReviewLevelId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
            .execute(PROCEDURE_NAME.ST_STOCKS_DETAIL_UPDATESTATUS_ADMINWEB);
        return new ServiceResponse(true, 'change status success', { isSuccess: true });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.changeStatusStocksDetail' });
        return new ServiceResponse(false);
    }
};

// create or update StocksDetail
const createOrUpdateStocksDetail = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        //check name
        const dataCheck = await pool
            .request()
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
            .input('STOCKSREVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_name'))
            .execute(PROCEDURE_NAME.ST_STOCKS_DETAIL_CHECKNAME_ADMINWEB);
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKS_REVIEW_LEVEL.EXISTS_NAME, null);
        }

        const data = await pool
            .request()
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
            .input('STOCKSREVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISSTOCKSIN', apiHelper.getValueFromObject(bodyParams, 'is_stocks_in'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISSTOCKSOUT', apiHelper.getValueFromObject(bodyParams, 'is_stocks_out'))
            .input('ISSTOCKSTAKE', apiHelper.getValueFromObject(bodyParams, 'is_stocks_take'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKS_DETAIL_CREATEORUPDATE_ADMINWEB);
        const stocksReviewLevelId = data.recordset[0].RESULT;

        if (stocksReviewLevelId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKS_REVIEW_LEVEL.CREATE_FAILED);
        }

        return new ServiceResponse(true, 'update success', stocksReviewLevelId);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.createOrUpdateStocksDetail' });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKS_REVIEW_LEVEL.CREATE_FAILED);
    }
};

const getListProductImeiCode = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'inputValue'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETLISTPRODUCTIMEICODE_ADMINWEB);
        let listProductImeiCode = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksDetailClass.listProductImeiCode(listProductImeiCode),
            page: currentPage,
            limit: itemsPerPage,
            // 'total': data.recordsets[1][0].TOTAL
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListProductImeiCode' });
        return new ServiceResponse(false, e.message);
    }
};

const getUnitList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETLISTUNITSUBUNIT_ADMINWEB);
        let UnitList = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksDetailClass.listUnit(UnitList),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getUnitList' });
        return new ServiceResponse(false, e.message);
    }
};

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProductImeiStocksOut = async (queryParams = {}) => {
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
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETLISTPRODUCTIMEI_STOCKSOUT_ADMINWEB);
        const StocksDetails = data.recordsets[0];
        const totalItem = data.recordsets[1][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: stocksDetailClass.listProductImeiStocksOut(StocksDetails),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListProductImeiStocksOut' });
        return new ServiceResponse(false, e.message);
    }
};

const getListProductImeiCodeStocks = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id') * 1)
            .input('MATERIALID', apiHelper.getValueFromObject(queryParams, 'material_id') * 1)
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('NUMDAYSFROM', apiHelper.getValueFromObject(queryParams, 'num_days_from'))
            .input('NUMDAYSTO', apiHelper.getValueFromObject(queryParams, 'num_days_to'))
            .input('ISOUTOFSTOCK', apiHelper.getValueFromObject(queryParams, 'is_out_of_stock'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ISOVERTIMEINVENTORY', apiHelper.getValueFromObject(queryParams, 'is_over_time_inventory'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETLISTPROIMEICODESTOCKS);
        let listProductImeiCode = data.recordset;
        let total_inventory = data.recordsets[1][0].TOTALINVENTORY ?? 0;
        const { total_cost_price, total_cost_basic_imei_code } = await calTotalCost(queryParams);

        return new ServiceResponse(true, '', {
            data: stocksDetailClass.listProductImeiCode(listProductImeiCode),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            total_inventory: total_inventory,
            total_cost_price,
            total_cost_basic_imei_code,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListProductImeiCodeStocks' });
        return new ServiceResponse(false, e.message);
    }
};

const getListExchangeQty = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const quantity = apiHelper.getValueFromObject(queryParams, 'quantity'); // so luong con lai trong kho de quy doi
        const inputUnitId = apiHelper.getValueFromObject(queryParams, 'unit_id'); // don vi  nhap kho
        const stocksDetailId = apiHelper.getValueFromObject(queryParams, 'stocks_detail_id'); // chi tiet kho

        const data = await pool
            .request()
            .input('STOCKSDETAILID', stocksDetailId)
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETSTOCKSINDENSITY);
        const subunits = stocksDetailClass.listStocksInDensity(data.recordset);
        let outputUnits = {};
        (subunits || []).forEach((v) => {
            if (!outputUnits[v.sub_unit_id] && v.sub_unit_id != inputUnitId)
                outputUnits[v.sub_unit_id] = { unit_id: v.sub_unit_id, unit_name: v.sub_unit_name };
            if (!outputUnits[v.main_unit_id] && v.sub_unit_id != inputUnitId)
                outputUnits[v.main_unit_id] = { unit_id: v.main_unit_id, unit_name: v.main_unit_name };
        });
        outputUnits = Object.values(outputUnits);
        // Quy doi
        (outputUnits || []).forEach((u) => {
            const exchangeQty = convertUnitDensity(subunits, {
                input_unit_id: inputUnitId,
                output_unit_id: u.unit_id,
                quantity,
            });
            u.exchange_qty = exchangeQty;
        });

        return new ServiceResponse(true, '', outputUnits);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListExchangeQty' });
        return new ServiceResponse(false, e.message);
    }
};
const getOptionsUserImport = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETOPTIONSUSERIMPORT_ADMINWEB);
        const users = stocksDetailClass.listUser(data.recordset);
        return new ServiceResponse(true, '', users);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsUserImport',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListRequestByProductImeiCode = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(bodyParams, 'product_imei_code'))
            .execute(PROCEDURE_NAME.ST_STOCKSDETAIL_GETLISTREQUESTBYIMEI_ADMINWEB);
        const product = stocksDetailClass.productImeiCode(data.recordset[0]);
        const request_list = stocksDetailClass.listRequest(data.recordsets[1]);
        return new ServiceResponse(true, '', { product, request_list });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsUserImport',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsProduct = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword'))
            .input('CATEGORYID', apiHelper.getValueFromObject(bodyParams, 'category_id'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams, 'model_id'))
            .execute('ST_STOCKSDETAIL_GetOptionsProduct_AdminWeb');
        const products = stocksDetailClass.productOptions(data.recordset);
        return new ServiceResponse(true, '', products);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsProduct',
        });
        return new ServiceResponse(false, e.message);
    }
};
const getListProductImeiToDivide = async (bodyParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(bodyParams);
        const itemsPerPage = apiHelper.getItemsPerPage(bodyParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_id'))
            .input('PRODUCTOLDTYPEID', apiHelper.getValueFromObject(bodyParams, 'product_old_type_id'))
            .execute('ST_STOCKSDETAIL_GetListProductImeiToDivide_AdminWeb');
        return new ServiceResponse(true, '', {
            data: stocksDetailClass.productsImei(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getListProductImeiToDivide',
        });
        return new ServiceResponse(false, e.message);
    }
};

// gom nhóm các sản phẩm có cùng ngành hàng trong chi nhánh
const groupByByCategory = (type, data) => {
    return _.chain(data)
        .groupBy(`${type}`)
        .map((value, key) => ({
            category_id: key,
            category_name: `${
                value && value.length > 0 && value[0] && value[0].category_name_global
                    ? value[0].category_name_global
                    : 'Không xác định'
            }`,
            total_inventory: sum(value),
        }))
        .value();
};

// Tính tổng tồn kho của ngành hàng đó
const sum = (output) => {
    return (output || []).reduce((acc, cur) => acc + (cur.total_inventory > 0 ? cur.total_inventory : 0), 0);
};

// Tạo mã màu random
const randomColor = () => {
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    return 'rgb(' + x + ',' + y + ',' + z + ')';
};

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStocksDetailForReport = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'start_date');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'end_date');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'category_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
            .input('MATERIALID', apiHelper.getValueFromObject(queryParams, 'material_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ISOUTOFSTOCK', apiHelper.getValueFromObject(queryParams, 'is_out_of_stock'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .execute('ST_STOCKSDETAIL_GetListReport_AdminWeb');
        const StocksDetails = data.recordsets[0];
        let result = stocksDetailClass.list(StocksDetails);

        // Nhóm các sản phẩm có cùng chi nhánh , và có cùng ngành hàng => tính tổng tồn kho
        let resultGroupBy = _.chain([...result])
            .groupBy('business_id')
            .map((value, key) => ({
                // Nhóm theo chi nhánh (key)
                business_id: key,
                // Random mã màu thể hiện của chi nhánh đó
                backgroundColor: `${randomColor()}`,
                // Tên của chi nhánh
                label: `${
                    value && value.length > 0 && value[0] && value[0].business_name
                        ? value[0].business_name
                        : 'Không xác định'
                }`,
                // Độ lớn nhỏ của mỗi cột
                barThickness: 124,
                // Nhóm các sản phẩm có cùng ngành hàng theo chi nhánh và trả ra tồn kho của chi nhánh đó
                data: groupByByCategory('category_id_global', value).reduce(
                    (a, v) => ({ ...a, [v.category_name]: v.total_inventory }),
                    {},
                ),
            }))
            .value();

        // Lấy các item có category ID
        const ids = ([...result] || []).map((o) => o.category_id_global);

        // Lược bỏ các item có category id bị trùng lấy danh sách chỉ tồn tại duy nhất
        const filtered = ([...result] || []).filter(
            ({ category_id_global }, index) => !ids.includes(category_id_global, index + 1),
        );

        // Danh sách các ngành hàng để hiển thị ở trục x
        let lables = (filtered || []).map((item) => {
            return item.category_name_global;
        });

        return new ServiceResponse(true, '', {
            items: result,
            page: currentPage,
            itemsPerPage: itemsPerPage,
            lables: lables,
            datasets: resultGroupBy,
            totalItems: apiHelper.getTotalData(data.recordset), //data.recordset[0].TOTALITEMS,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListStocksDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcelInventory = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = String(API_CONST.MAX_EXPORT_EXCEL);

        serviceRes = await getListStocksDetailForReport(queryParams);

        const { items } = serviceRes.getData();

        let wb = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        // Khai bao style cho excel
        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
            },
            row: {
                border: {
                    bottom: { style: 'dashed' },
                    left: { style: 'thin' },
                },
            },
            last_row: {
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                },
            },
            row_last_column: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
            },
            border: {
                line: {
                    top_right: {
                        border: {
                            top: {
                                style: 'thin',
                            },
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    right: {
                        border: {
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    left_top_right: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                    },
                    all: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' },
                    },
                },
                line_top_left: {
                    border: {
                        top: {
                            style: 'thick',
                            colo: 'black',
                        },
                        left: {
                            style: 'thick',
                            colo: 'black',
                        },
                    },
                },
            },
        };

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Chi tiết');

        const column = 10;
        const rowHeader = 4;

        // Khai báo header
        const header = {
            stt: 'STT',
            business_name: 'Chi nhánh',
            stocks_name: 'Kho',
            product_code: 'Mã sản phẩm',
            product_name: 'Tên sản phẩm',
            unit_name: 'Đơn vị tính',
            total_in: 'Tổng nhập',
            total_out: 'Tổng xuất',
            total_inventory: 'Tổng tồn',
            type_item: 'Loại',
            category_name_global: 'Ngành hàng/Nhóm Linh kiện',
        };

        ws.cell(1, 1, 1, column, true)
            .string(`BÁO CÁO TỒN KHO`)
            .style({
                ...styles.bold_center,
                border: {
                    right: { style: 'none' },
                },
            });

        // Set height and height
        ws.row(4).setHeight(25);
        ws.column(0).setWidth(15);
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(25);
        ws.column(3).setWidth(25);
        ws.column(4).setWidth(25);
        ws.column(5).setWidth(55);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(25);
        ws.column(column + 1).setWidth(25);

        //Render data
        items.unshift(header);
        const maxRow = rowHeader + items.length - 1;
        items.forEach((item, index) => {
            let indexRow = index + rowHeader;
            let indexCol = 0;
            let stt = index;
            if (index == 0) {
                ws.cell(indexRow, ++indexCol)
                    .string((item.stt || '').toString())
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
            } else {
                ws.cell(indexRow, ++indexCol)
                    .string(stt.toString())
                    .style(
                        indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row,
                    );
            }
            //add on
            ws.cell(indexRow, ++indexCol)
                .string((item.business_name || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_name || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.product_code || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.product_name || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);

            ws.cell(indexRow, ++indexCol)
                .string((item.unit_name || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.total_in || 0).toString())
                .style(
                    indexRow == rowHeader
                        ? { ...styles.header, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } }
                        : indexRow < maxRow
                        ? styles.row
                        : styles.last_row,
                );
            ws.cell(indexRow, ++indexCol)
                .string((item.total_out || 0).toString())
                .style(
                    indexRow == rowHeader
                        ? { ...styles.header, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } }
                        : indexRow < maxRow
                        ? styles.row
                        : styles.last_row,
                );
            ws.cell(indexRow, ++indexCol)
                .string((item.total_inventory || 0).toString())
                .style(
                    indexRow == rowHeader
                        ? { ...styles.header, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } }
                        : indexRow < maxRow
                        ? styles.row
                        : styles.last_row,
                );
            ws.cell(indexRow, ++indexCol)
                .string((item.type_item || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
            ws.cell(indexRow, ++indexCol)
                .string((item.category_name_global || '').toString())
                .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        });
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'stocksDetailService.exportExcelReport' });
        return new ServiceResponse(false, error.message || error);
    }
};

const getListIMEI = async (queryParams) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getSearch(queryParams)?.trim())
            .input('ID', apiHelper.getValueFromObject(queryParams, 'id'))
            .input('TABLE', apiHelper.getValueFromObject(queryParams, 'table'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('STOCKSTYPE', apiHelper.getValueFromObject(queryParams, 'stock_type'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(queryParams, 'order_type_id'))
            // 1: Kho hàng mới, 2: Kho hàng cũ, 3: Kho bảo hành, 4: Kho hàng lỗi,
            // 5: Kho hàng trưng bày, 6: Kho hàng trôi bảo hành, 7: Kho hàng dự án,
            // 8: Kho phụ kiện, 9: Kho công ty, 10: Kho chờ xử lý khác, 11: Kho PreOrder
            .execute('ST_STOCKSDETAIL_GetListIMEI_AdminWeb');

        const imeis = stocksDetailClass.listIMEI(data.recordset);

        return new ServiceResponse(true, '', imeis);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListIMEI' });
        return new ServiceResponse(false, e, []);
    }
};

const getListProductForCogs = async (queryParams) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute('ST_COGS_GetAllProduct_AdminWeb');

        return stocksDetailClass.product(data.recordset);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListProductForCogs' });
        return [];
    }
};

const calStocksIn = async ({ stocks_ids, stocks_id, product_id, start_date, end_date }) => {
    try {
        const pool = await mssql.pool;
        const stocksIntRes = await pool
            .request()
            .input('STOCKSLIST', stocks_ids)
            .input('STOCKSID', stocks_id)
            .input('PRODUCTID', product_id)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .execute('ST_COGS_GetStocksIn_AdminWeb');
        return stocksIntRes.recordset[0] ?? { total_money: 0, quantity: 0 };
    } catch (error) {
        logger.error(error, { function: 'stocksDetailService.calStocksIn' });
        return { total_money: 0, quantity: 0 };
    }
};

const calInvertoryLastest = async ({ stocks_ids, stocks_id, product_id, start_date }) => {
    try {
        const pool = await mssql.pool;
        const dataRes = await pool
            .request()
            .input('STOCKSID', stocks_id)
            .input('STOCKSLIST', stocks_ids)
            .input('PRODUCTID', product_id)
            .input('STARTDATE', start_date)
            .execute('ST_COGS_GetInventoryLast_AdminWeb');
        return dataRes.recordset[0]?.TOTALINVENTORY ?? 0;
    } catch (error) {
        logger.error(error, { function: 'stocksDetailService.calInvertoryLastest' });
        return 0;
    }
};

const countProductByStocksOutRequestId = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PRODUCTID', queryParams.product_id)
            .input('STOCKID', queryParams.stocks_id)
            .input('STOCKSOUTREQUESTID', queryParams.stock_out_request_id)
            .execute('ST_STOCKSOUTREQUEST_CountProductByStocksoutrequestId_AdminWeb');
        const result = res.recordset[0].COUNTPRODUCT;

        if (result <= 0) {
            throw Error('Lấy hạch toán theo đơn hàng thất bại');
        }
        return result;
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.countProductByStocksOutRequestId' });
        return false;
    }
};

const updateAccountingDetail = async (queryParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const resultAccounting = await pool
            .request()
            .input('ACCOUNTINGID', queryParams.accounting_id)
            .input('COGSPRICE', queryParams.cogs_price)
            .execute('AC_ACCOUNTING_DETAIL_UpdatePrice_AdminWeb');
        const result = resultAccounting.recordset[0].RESULT;
   
        if (!result) {
            await transaction.rollback();
            throw Error('Cập nhật AC_ACCOUNTING_DETAIL thất bại');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Cập nhật AC_ACCOUNTING_DETAIL thành công');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'stocksDetailService.updateAccountingDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const getListAccountingIdByOrderid = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('STOCKSOUTREQUESTID', queryParams.stock_out_request_id)
            .execute('AC_ACCOUNTING_GetAccountingIdByOrderid_AdminWeb');
        const result = res.recordset[0].ACCOUNTINGID;

        if (!result) {
            throw Error('Lấy hạch toán theo đơn hàng thất bại');
        }
        return result;
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListAccountingIdByOrderid' });
        return false;
    }
};

const getOrderidByStockidAndProductid = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('STOCKSID', queryParams.stocks_id)
            .input('PRODUCTID', queryParams.product_id)
            .execute('SL_ORDER_GetOrderidListByStockidAndProductid_AdminWeb');
        const result = res.recordset;

        if (result?.length < 0) {
            throw Error('Lấy danh sách đơn hàng thất bại');
        }
        return result;
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getOrderidByStockidAndProductid' });
        return false;
    }
};

const createOrUpdateCogs = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('COGSID', null)
            .input('PRICINGMETHODID', queryParams.calculate_method)
            .input('STOCKSID', queryParams.stocks_id)
            .input('STARTDATE', queryParams.start_date)
            .input('ENDDATE', queryParams.end_date)
            .input('PRODUCTID', queryParams.product_id)
            .input('COGSPRICE', queryParams._cogs)
            .input('PERIOD', queryParams.period)
            .input('CREATEDUSER', queryParams.auth_name)
            .execute('ST_COGS_CreateOrUpdate_AdminWeb');
        const result = res.recordset[0].RESULT;
        if (!result) {
            throw Error('Tính giá xuất kho thất bại');
        }
        return true;
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.createOrUpdateCogs' });
        return false;
    }
};

const calPriceExport = async (queryParams = {}) => {
    try {
        const calculate_not_according_stocks = queryParams.calculate_not_according_stocks;
        const all_product = queryParams.all_product;
        const stocksIn = queryParams.stocksIn;
        const stocksOut = queryParams.stocksOut;
        let stocks_ids = queryParams.stocks_ids;

        // Tính giá theo kho ko cần stocks_ids
        if (!calculate_not_according_stocks) {
            stocks_ids = null;
        }
        const start_date = queryParams.start_date;
        const end_date = queryParams.end_date;
        const calculate_method = queryParams.calculate_method;
        const period = queryParams.period;
        let stocks_id = queryParams.stocks_id;
        const current_stocks_id = stocks_id;
        if (calculate_not_according_stocks) {
            stocks_id = null;
        }
        const cogs_list = queryParams.cogs_list; // tìm giá xuất của kỳ trước đó

        let cogs_list_instance = {};
        if (!calculate_not_according_stocks) {
            for (const item of cogs_list) {
                if (item.cogs_price <= 0) continue;
                if (!cogs_list_instance[`${item.product_id}_${item.stocks_id}`]) {
                    // Lấy giá xuất kho mới nhất
                    cogs_list_instance[`${item.product_id}_${item.stocks_id}`] = item;
                }
            }
        }

        const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name');
        let _cogs;
        for (const item of all_product) {
            // Tổng số lượng và tổng tiền nhập từ ngày đến ngày
            const { quantity, total_money } = await calStocksIn({
                stocks_ids,
                product_id: item.product_id,
                start_date,
                end_date,
                stocks_id,
            });

            const cogs = calculate_not_according_stocks
                ? cogs_list[0]
                : cogs_list_instance[`${item.product_id}_${stocks_id}`];

            if (!cogs) {
                // nếu không có giá xuất
                _cogs = Math.round(total_money / quantity);
            } else {
                // Bình quân sau mỗi lần nhập
                if (calculate_method === CALCULATE_METHODS.CONTINUOSAVCO) {
                    // Lấy lần nhập mới nhất
                    const { total_in, total_price_cost } = stocksIn.shift();
                    // nếu có giá xuất kho
                    const total_in_quantity = calTotalQuantity(stocksIn, item.product_id, stocks_id, 'total_in') ?? 0; // Tổng số lượng nhâp kho của sản phẩm không bao gồm lần nhập mới nhất
                    const total_out_quantity = calTotalQuantity(stocksOut, item.product_id, stocks_id, 'total_out') ?? 0; // Tổng số lượng xuất kho của sản phẩm
                    // Tính V1
                    // let inventory_quantity = total_in_quantity - total_out_quantity; // số lượng tồn kho của kỳ trước đó
                    // let inventory_money = inventory_quantity * cogs?.cogs_price; // tổng thành tiền tồn kỳ trước đó
                    // _cogs = Math.round((total_money + inventory_money) / (quantity + inventory_quantity));

                    // Tính V2
                    let inventory_quantity = total_in_quantity - total_out_quantity; // số lượng tồn kho của kỳ trước đó
                    let inventory_money = inventory_quantity * cogs?.cogs_price; // tổng thành tiền tồn kỳ trước đó
                    let total_in_money_lastest = total_in * total_price_cost; // tổng tiền của lần nhập mới nhất
                    _cogs = Math.round((inventory_money + total_in_money_lastest) / (inventory_quantity + total_in));

                    // Nếu ko có nhập kho trong khoảng thời gian thì lấy giá xuất kho gần nhất
                    if (quantity <= 0) {
                        _cogs = cogs?.cogs_price;
                    }
                } else if (calculate_method === CALCULATE_METHODS.PREIODICAVCO) {
                    // Bình quân cuối kỳ

                    // Tồn cuối kỳ tháng trước
                    const total_inventory_lastest = await calInvertoryLastest({
                        stocks_id: current_stocks_id,
                        stocks_ids,
                        start_date,
                        product_id: item.product_id,
                    });

                    // Tính V2
                    let inventory_money = total_inventory_lastest * cogs?.cogs_price; // tổng thành tiền tồn kỳ trước đó
                    _cogs = Math.round((inventory_money + total_money) / (total_inventory_lastest + quantity));

                    // Nếu ko có nhập kho trong khoảng thời gian thì lấy giá xuất kho gần nhất
                    if (quantity <= 0) {
                        _cogs = cogs?.cogs_price;
                    }
                }
            }
            if (isNaN(_cogs)) _cogs = 0;

            await createOrUpdateCogs({
                calculate_method,
                stocks_id: current_stocks_id,
                start_date,
                end_date,
                product_id: item.product_id,
                _cogs,
                period,
                auth_name,
            });

            // Lấy dánh sách phiếu xuất dựa trên Stockid và Productid
            const resStockOutRequestList =  await getOrderidByStockidAndProductid({
                stocks_id: current_stocks_id,
                product_id: item.product_id,
                auth_name,
            });
            
            if(resStockOutRequestList?.length > 0) { 
                for (let i = 0; i < resStockOutRequestList.length; i++) {
                    //Lấy id hạch toán dựa trên StockOutRequestId
                    const accountingId = await getListAccountingIdByOrderid({stock_out_request_id : resStockOutRequestList[i].STOCKSOUTREQUESTID})

                    // if(resStockOutRequestList[i].STOCKSOUTREQUESTID){
                    //     const accountingId = await getListAccountingIdByOrderid({stock_out_request_id : resStockOutRequestList[i].STOCKSOUTREQUESTID})
                    // }

                    if (accountingId) {
                        // Đếm số sản phẩm trong phiếu xuất kho
                        const countProduct = await countProductByStocksOutRequestId({
                            stock_out_request_id : resStockOutRequestList[i].STOCKSOUTREQUESTID,
                            stocks_id: current_stocks_id,
                            product_id: item.product_id,
                        })
                        
                        //Tính toán lại giá sản phẩm AC_ACCOUNTING_DETAIL
                        await updateAccountingDetail({accounting_id : accountingId, cogs_price: _cogs * countProduct})
                    }
                }
            }

        }
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.calPriceExport' }); 
        return [];
    }
};

const calculateOutStocks = async (params) => {
    const pool = await mssql.pool;
    try {
        const calculate_method = apiHelper.getValueFromObject(params, 'calculate_method', null);
        if (!Object.values(CALCULATE_METHODS).includes(calculate_method))
            return new ServiceResponse(false, 'Phương pháp tính đang phát triển');

        const stocks_id = apiHelper.getValueFromObject(params, 'stocks_id');

        const auth_name = apiHelper.getValueFromObject(params, 'auth_name', null);
        const stocks_type_list = apiHelper.getValueFromObject(params, 'stocks_type_list', null);
        const need_calculate_goods = apiHelper.getValueFromObject(params, 'need_calculate_goods', null); // Hàng hóa cần tính giá
        const selected_product = apiHelper.getValueFromObject(params, 'selected_product');
        const choose_calculate_goods = apiHelper.getValueFromObject(params, 'choose_calculate_goods', null); // Hàng hóa được chọn
        const product_list = choose_calculate_goods ? selected_product?.map((item) => item.product_id).join('|') : null;
        const calculate_date = apiHelper.getValueFromObject(params, 'calculate_date');
        const start_date = apiHelper.getValueFromObject(params, 'start_date');
        const end_date = apiHelper.getValueFromObject(params, 'end_date');
        const period = apiHelper.getValueFromObject(params, 'period');
        const calculate_according_stocks = apiHelper.getValueFromObject(params, 'calculate_according_stocks', null);
        const calculate_not_according_stocks = apiHelper.getValueFromObject(
            params,
            'calculate_not_according_stocks',
            null,
        );

        //Select stocks by stocks type
        const stocksRes = await pool
            .request()
            .input('STOCKSTYPELIST', stocks_type_list.map((item) => item.id ?? item).join('|'))
            .execute('ST_COGS_GetStocksByStocksType_AdminWeb');
        const stocksList = stocksDetailClass.stocksList(stocksRes.recordset);

        const stocks_ids = stocksList.map((item) => item.stocks_id).join('|');

        // bình quân gia quyền cuối kỳ || bình quân gia quyền mỗi lần nhập
        const stocksInStocksOutRes = await pool
            .request()
            .input('STOCKSLIST', stocks_ids)
            .input('PRODUCTLIST', product_list)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('PERIOD', period)
            .input('PRICINGMETHODID', calculate_method)
            .execute('ST_COGS_GetInventoryPrePeriod_AdminWeb');
        const stocksIn = stocksDetailClass.stocksIn(stocksInStocksOutRes.recordsets[0]); // Tổng nhập <= start_date
        const stocksOut = stocksDetailClass.stocksOut(stocksInStocksOutRes.recordsets[1]); // Tổng xuất <= start_date
        const cogs_list = stocksDetailClass.cogs(stocksInStocksOutRes.recordsets[2]);

        if (need_calculate_goods && stocks_id) {
            // Hàng hóa cần tính giá --- tính tất cả hàng hóa trong kho được chọn
            let all_product = await getListProductForCogs();
            if (calculate_not_according_stocks) {
                // tính giá không theo kho
                // for (let i = 0; i < stocksList.length; i++) {
                    const isSuccess = calPriceExport({
                        all_product,
                        stocksIn,
                        stocksOut,
                        stocks_ids,
                        start_date,
                        end_date,
                        calculate_method,
                        period,
                        stocks_id: stocks_id,
                        // stocks_id: stocksList[i].stocks_id,
                        cogs_list,
                        calculate_not_according_stocks,
                        auth_name,
                    });
                    // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
                // }
            } else if (calculate_according_stocks) {
                // tính giá theo kho
                // for (let i = 0; i < stocksList.length; i++) {
                    all_product = await getListProductForCogs({ stocks_id: stocks_id });
                    const isSuccess = calPriceExport({
                        all_product,
                        stocksIn,
                        stocksOut,
                        stocks_ids,
                        start_date,
                        end_date,
                        calculate_method,
                        period,
                        stocks_id: stocks_id,
                        // stocks_id: stocksList[i].stocks_id,
                        cogs_list,
                        calculate_not_according_stocks,
                        auth_name,
                    });
                    // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
                // }
            }
        } else if (choose_calculate_goods && stocks_id) {
            // Hàng hóa được chọn
            if (calculate_not_according_stocks) {
                // tính giá không theo kho
                // for (let i = 0; i < stocksList.length; i++) {
                    const isSuccess = calPriceExport({
                        all_product: selected_product,
                        stocksIn,
                        stocksOut,
                        stocks_ids,
                        start_date,
                        end_date,
                        calculate_method,
                        period,
                        stocks_id: stocks_id,
                        // stocks_id: stocksList[i].stocks_id,
                        cogs_list,
                        calculate_not_according_stocks,
                        auth_name,
                    });
                    // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
                // }
            } else if (calculate_according_stocks) {
                // tính giá theo kho
                // for (let i = 0; i < stocksList.length; i++) {
                    const isSuccess = calPriceExport({
                        all_product: selected_product,
                        stocksIn,
                        stocksOut,
                        stocks_ids,
                        start_date,
                        end_date,
                        calculate_method,
                        period,
                        stocks_id: stocks_id,
                        // stocks_id: stocksList[i].stocks_id,
                        cogs_list,
                        calculate_not_according_stocks,
                        auth_name,
                    });
                    // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
                // }
            }
        }
        return new ServiceResponse(true, 'Tính giá xuất kho thành công');
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.calculateOutStocks' });
        return new ServiceResponse(false, e.message || e);
    }
};

const getLastCalculateDate = async (queryParams) => {
    try { 
        const pool = await mssql.pool;

        const data = await pool.request().execute('ST_COGS_GetLastDate_AdminWeb');

        const date = stocksDetailClass.lastDate(data.recordset);
        return new ServiceResponse(true, '', date);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getLastCalculateDate' });
        return new ServiceResponse(false, e, []);
    }
};

const createOrUpdateCogsSettings = async (queryParams = {}) => {
    try {
        const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name', []);
        const selected_product = queryParams.selected_product;
        if (selected_product && selected_product?.length > 0) {
            queryParams.selected_product = selected_product.filter((item) => item !== null);
        }
        for (const key of Object.keys(keysConfigMapping)) {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('CONFIGTYPE', 'ST_COGS')
                .input('KEYCONFIG', keysConfigMapping[key])
                .input('VALUECONFIG', arrayToString(queryParams[key] ?? 0))
                .input('CREATEDUSER', auth_name)
                .execute('SYS_APPCONFIG_UpdatePageSetting_AdminWeb');
        }

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.createOrUpdateCogsSettings' });
        return new ServiceResponse(false, e, []);
    }
};

const getCogsSettings = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYSCONFIG', Object.values(keysConfigMapping).join('|'))
            .execute('ST_COGS_GetCogSettings_AdminWeb');

        const result = stocksDetailClass.configsSettings(data.recordset);
        if (parseInt(result.need_calculate_goods) === 1) {
            result.choose_calculate_goods = 0;
            result.selected_product = [];
        } else {
            result.choose_calculate_goods = 1;
            result.need_calculate_goods = 0;
            if (!Array.isArray(result.selected_product)) {
                result.selected_product = [result.selected_product];
            }
        }
        result.all_days = result.type_run_service === 1 ? 1 : 0;
        result.last_days_of_month = result.type_run_service === 2 ? 1 : 0;

        result.calculate_according_stocks = result.type_calculating === 1 ? 1 : 0;
        result.calculate_not_according_stocks = result.type_calculating === 2 ? 1 : 0;

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getCogsSettings' });
        return new ServiceResponse(false, e, []);
    }
};

const getStocksOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTYPEIDS', apiHelper.getValueFromObject(queryParams, 'stocks_type_ids'))
            .input('STOREIDS', apiHelper.getValueFromObject(queryParams, 'store_ids'))
            .execute('ST_COGS_GetStocksOptions_AdminWeb');

        return new ServiceResponse(true, '', stocksDetailClass.stocksOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getCogsSettings' });
        return new ServiceResponse(false, e, []);
    }
};
const calTotalCost = async (queryParams) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id') * 1)
            .input('MATERIALID', apiHelper.getValueFromObject(queryParams, 'material_id') * 1)
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('NUMDAYSFROM', apiHelper.getValueFromObject(queryParams, 'num_days_from'))
            .input('NUMDAYSTO', apiHelper.getValueFromObject(queryParams, 'num_days_to'))
            .input('ISOUTOFSTOCK', apiHelper.getValueFromObject(queryParams, 'is_out_of_stock'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ISOVERTIMEINVENTORY', apiHelper.getValueFromObject(queryParams, 'is_over_time_inventory'))
            .execute('ST_STOCKSDETAIL_CalTotalCost_AdminWeb');

        const dataRecord = data.recordset[0];

        return {
            total_cost_price: dataRecord.COSTPRICE ?? 0,
            total_cost_basic_imei_code: dataRecord.COSTBASICIMEICODE ?? 0,
        };
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.calTotalCost' });
        return {};
    }
};

const getListDataStock = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'category_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
            .input('MATERIALID', apiHelper.getValueFromObject(queryParams, 'material_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ISOUTOFSTOCK', apiHelper.getValueFromObject(queryParams, 'is_out_of_stock'))
            .input('PERIOD', apiHelper.getValueFromObject(queryParams, 'period'))
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('AUTHNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('INVENTORYSTATUS', apiHelper.getValueFromObject(queryParams, 'inventory_status'))
            .execute('ST_STOCKSDETAIL_GetList_Export_AdminWeb');
        const StocksDetails = data.recordsets[0];
        const result = stocksDetailClass.getDataExport(StocksDetails);
        // result = handleMergeData(result);

        return new ServiceResponse(true, '', {
            data: result,
            total: apiHelper.getTotalData(data.recordset), //data.recordset[0].TOTALITEMS,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksDetailService.getListStocksDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcelStock = async (queryParams) => {
    try {
        // console.log('queryParams', queryParams);
        const dataRes = await getListDataStock(queryParams);
        // console.log('dataRes', dataRes);

        if (dataRes.isFailed()) {
            return new ServiceResponse(false, dataRes.getErrors());
        }
        const { data } = dataRes.getData();

        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true, color: 'FFFFFF' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
            },
            row: {
                border: {
                    bottom: { style: 'dashed' },
                    left: { style: 'thin' },
                },
            },
            last_row: {
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                },
            },
            row_last_column: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
            },
            border: {
                line: {
                    top_right: {
                        border: {
                            top: {
                                style: 'thin',
                            },
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    right: {
                        border: {
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    left_top_right: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                    },
                    all: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' },
                    },
                },
                line_top_left: {
                    border: {
                        top: {
                            style: 'thick',
                            colo: 'black',
                        },
                        left: {
                            style: 'thick',
                            colo: 'black',
                        },
                    },
                },
            },
            body_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
            },
        };

        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Danh sách tồn kho');

        work_sheet.row(1).setHeight(40);
        work_sheet.column(1).freeze();
        work_sheet.column(4).setWidth(50);

        const obj_short = [1, 2, 3, 5, 6, 7, 8];

        obj_short.map((item, index) => work_sheet.column(item).setWidth(20));

        work_sheet.cell(1, 1, 1, 1, true).string('Kho').style(styles.bold_center);
        work_sheet.cell(1, 2, 1, 2, true).string('Chi nhánh').style(styles.bold_center);
        work_sheet.cell(1, 3, 1, 3, true).string('Mã hàng').style(styles.bold_center);
        work_sheet.cell(1, 4, 1, 4, true).string('Tên hàng').style(styles.bold_center);
        work_sheet.cell(1, 5, 1, 5, true).string('Tồn đầu kỳ').style(styles.bold_center);
        work_sheet.cell(1, 6, 1, 6, true).string('Tổng nhập').style(styles.bold_center);
        work_sheet.cell(1, 7, 1, 7, true).string('Tổng xuất').style(styles.bold_center);
        work_sheet.cell(1, 8, 1, 8, true).string('Tồn cuối kỳ').style(styles.bold_center);

        let row_position = 2;
        for (let i = 0; i < data.length; i++) {
            work_sheet.cell(row_position, 1).string(`${data[i]?.stocks_name || ''}`);
            work_sheet.cell(row_position, 2).string(`${data[i]?.store_name || ''}`);
            work_sheet.cell(row_position, 3).string(`${data[i]?.product_code || ''}`);
            work_sheet.cell(row_position, 4).string(`${data[i]?.product_name || ''}`);
            work_sheet
                .cell(row_position, 5)
                .number(Number(`${data[i]?.total_first - data[i]?.total_out || 0} `))
                .style({
                    font: {
                        color: 'FFFF0000',
                    },
                });
            work_sheet
                .cell(row_position, 6)
                .number(Number(`${data[i]?.total_in || ''}`))
                .style({
                    font: {
                        color: 'FFFF0000',
                    },
                });
            work_sheet
                .cell(row_position, 7)
                .number(Number(`${data[i]?.total_out || ''}`))
                .style({
                    font: {
                        color: 'FFFF0000',
                    },
                });
            work_sheet
                .cell(row_position, 8)
                .number(
                    Number(
                        `${
                            Number(data[i]?.total_first) -
                                Number(data[i]?.total_out) +
                                Number(data[i]?.total_in) -
                                Number(data[i]?.total_out) || 0
                        }`,
                    ),
                )
                .style({
                    font: {
                        color: 'FFFF0000',
                    },
                });

            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (error) {
        logger.error(error, { function: 'stocksDetailService.getDataExport' });
        return new ServiceResponse(false, error.message, null);
    }
};

module.exports = {
    getListStocksDetail,
    detailStocksDetail,
    deleteStocksDetail,
    changeStatusStocksDetail,
    createOrUpdateStocksDetail,
    getListProductImeiCode,
    getUnitList,
    getListProductImeiStocksOut,
    getListProductImeiCodeStocks,
    getListExchangeQty,
    getOptionsUserImport,
    getListRequestByProductImeiCode,
    getOptionsProduct,
    getListProductImeiToDivide,
    getListStocksDetailForReport,
    exportExcelInventory,
    getListIMEI,
    calculateOutStocks,
    getLastCalculateDate,
    createOrUpdateCogsSettings,
    getCogsSettings,
    getStocksOptions,
    exportExcelStock,
};
