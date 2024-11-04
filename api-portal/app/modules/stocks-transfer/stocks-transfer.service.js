const stocksTransferClass = require('../stocks-transfer/stocks-transfer.class');
const unitService = require('../unit/unit.service');
const apiHelper = require('../../common/helpers/api.helper');
const pdfHelper = require('../../common/helpers/pdf.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const xl = require('excel4node');
const moment = require('moment');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const readXlsxFile = require('read-excel-file/node');
const { DELIVERY_STATUS } = require('./constant');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const orderService = require('../order/order.service');
const { orderType } = require('../order/ultils/constants');

// /**
//  * Get list CRM_SUPPLIER
//  *
//  * @param queryParams
//  * @returns ServiceResponse
//  */
const getListStocksTransfer = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const created_user = apiHelper.getValueFromObject(queryParams, 'created_user');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('STATUSTRANSFER', apiHelper.getValueFromObject(queryParams, 'status_transfer'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .input('STOCKSTRANSFERTYPEID', apiHelper.getValueFromObject(queryParams, 'stocks_transfer_type_id'))
            .input('STOCKSEXPORTID', apiHelper.getValueFromObject(queryParams, 'stocks_export_id'))
            .input('STOCKSIMPORTID', apiHelper.getValueFromObject(queryParams, 'stocks_import_id'))
            .input('CREATEDUSER', created_user ? created_user.value : null)
            .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('ST_STOCKSTRANSFER_GetList_AdminWeb');

        const item = data.recordset;

        const dataList = stocksTransferClass.list(item);

        // check delivery status
        dataList.forEach((item) => {
            if (item.estimate_delivery_time) {
                if (item.actual_delivery_time) {
                    const diff = moment(item.estimate_delivery_time).diff(moment(item.actual_delivery_time));
                    if (diff > 0) {
                        item.delivery_status = DELIVERY_STATUS.COMPLETED_ON_TIME;
                    } else {
                        item.delivery_status = DELIVERY_STATUS.COMPLETED_LATE;
                    }
                } else {
                    const diff = moment(item.estimate_delivery_time).diff(moment());
                    if (diff > 0) {
                        item.delivery_status = DELIVERY_STATUS.IN_PROGRESS;
                    } else {
                        item.delivery_status = DELIVERY_STATUS.LATE;
                    }
                }
            } else {
                item.delivery_status = DELIVERY_STATUS.NOT_YET;
            }
        });

        return new ServiceResponse(true, '', {
            data: dataList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getListStocksTransfer' });
        return new ServiceResponse(true, '', {});
    }
};

/**
 * createOrUpdateStocksTransfer
 */
const createOrUpdateStocksTransfer = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        const store_request_id = apiHelper.getValueFromObject(bodyParams, 'store_request_id');
        const request_user = apiHelper.getValueFromObject(bodyParams, 'request_user');
        const store_export_id = apiHelper.getValueFromObject(bodyParams, 'store_export_id');
        const export_user_id = apiHelper.getValueFromObject(bodyParams, 'export_user_id');
        const store_import_id = apiHelper.getValueFromObject(bodyParams, 'store_import_id');
        const stocks_import_id = apiHelper.getValueFromObject(bodyParams, 'stocks_import_id');
        const import_user_id = apiHelper.getValueFromObject(bodyParams, 'import_user_id');

        const requestCreateOrUpdate = new sql.Request(transaction);
        const data = await requestCreateOrUpdate
            .input('STOCKSTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_id'))
            .input('STOCKSTRANSFERCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_code'))
            .input('STOCKSTRANSFERTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_type_id'))
            .input('BUSINESSIMPORTID', apiHelper.getValueFromObject(bodyParams, 'business_import_id'))
            .input('BUSINESSEXPORTID', apiHelper.getValueFromObject(bodyParams, 'business_export_id'))
            .input('ISOTHERBUSINESS', apiHelper.getValueFromObject(bodyParams, 'is_orther_business'))
            .input('ESTIMATEDELIVERYDAYCOUNT', apiHelper.getValueFromObject(bodyParams, 'estimate_delivery_day_count'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('STOREREQUESTID', ['number', 'string'].includes(typeof store_request_id) ? store_request_id : store_request_id?.value)
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('REQUESTUSER', ['number', 'string'].includes(typeof request_user) ? request_user : request_user?.value)
            .input('STOREEXPORTID', ['number', 'string'].includes(typeof store_export_id) ? store_export_id : store_export_id?.value)
            .input('STOCKSEXPORTID', apiHelper.getValueFromObject(bodyParams, 'stocks_export_id'))
            .input('EXPORTUSER', ['number', 'string'].includes(typeof export_user_id) ? export_user_id : export_user_id?.value)
            .input('STOREIMPORTID', ['number', 'string'].includes(typeof store_import_id) ? store_import_id : store_import_id?.value)
            .input('STOCKSIMPORTID', ['number', 'string'].includes(typeof stocks_import_id) ? stocks_import_id : stocks_import_id?.value)
            .input('IMPORTUSER', ['number', 'string'].includes(typeof import_user_id) ? import_user_id : import_user_id?.value)
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CONTRACTNUMBER', apiHelper.getValueFromObject(bodyParams, 'contract_number'))
            .input('TRANSPORTPARTNER', apiHelper.getValueFromObject(bodyParams, 'transport_partner'))
            .input('TRANSPORTVEHICLE', apiHelper.getValueFromObject(bodyParams, 'transport_vehicle'))
            .input('HIDDENPRICE', apiHelper.getValueFromObject(bodyParams, 'hidden_price', 0))
            .input('TRANSPORTUSER', apiHelper.getValueFromObject(bodyParams, 'transport_user'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTRANSFER_CreateOrUpdate_AdminWeb');

        const stocksTransferId = data.recordset[0].RESULT;

        // insert table ST_STOCKSTRANSFERDETAIL
        let product_detail_list = apiHelper.getValueFromObject(bodyParams, 'product_transfer');
        product_detail_list = product_detail_list ? Object.values(product_detail_list) : [];

        if (product_detail_list && product_detail_list.length > 0 && stocksTransferId) {
            // tách lại sản phẩm sau khi gộp
            const products = product_detail_list.reduce((acc, item) => {
                if (Array.isArray(item.imei) && item.imei.length > 1) {
                    const cloneProducts = item.imei.map((_imie, index) => ({
                        ...item,
                        product_imei: _imie,
                        imei: [_imie],
                        stocks_detail_id: item.stock_detail_ids[index],
                        quantity: 1,
                    }));
                    acc = acc.concat(cloneProducts);
                } else {
                    acc.push(item);
                }
                return acc;
            }, []);
            product_detail_list = products;

            // Kiểm tra xem sản phẩm còn tồn tại số lượng trong kho hay không
            // ==> Lấy ra danh sách imei để kiểm tra
            let imeiCheckQuantity = product_detail_list
                .map((_product) => (Array.isArray(_product?.imei) ? _product?.imei : [_product?.imei]))
                .flat(Infinity)
                .join('|');

            // const dataCheckIMEI = await pool
            //     .request()
            //     .input('IMEICHECKQUANTITY', imeiCheckQuantity)
            //     .input('STOCKSEXPORTID', apiHelper.getValueFromObject(bodyParams, 'stocks_export_id'))
            //     .input('STOCKSTRANSFERID', stocksTransferId)
            //     .execute('ST_STOCKSTRANSFER_checkProductQuantity_AdminWeb');

            const imeiStockStatus = await pool
                .request()
                .input('IMEICHECKQUANTITY', imeiCheckQuantity)
                .input('STOCKSEXPORTID', apiHelper.getValueFromObject(bodyParams, 'stocks_export_id'))
                .execute('ST_STOCKSTRANSFER_CheckProductInventory_AdminWeb');

            // Kiểm tra nếu như có trả về danh sách imei lỗi dừng thêm mới và trả về danh sách lỗi
            if (imeiStockStatus?.recordset && imeiStockStatus.recordset?.length > 0) {
                const imieExists = imeiStockStatus.recordset.filter((_) => _.STATUS === 2);
                if (imieExists.length > 0) {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        `Sản phẩm imie ${imieExists
                            .map((_) => _.IMEI)
                            .join(
                                ', ',
                            )} đã được xuất kho trong thời gian duyệt phiếu! Vui lòng chọn lại imie sản phẩm chuyển kho !`,
                        imeiStockStatus.recordset,
                    );
                }
            }

            // ==> Nếu kiểm tra không có mã imei sản phẩm trong tình trạng đang xuất kho
            const table = new sql.Table('ST_STOCKSTRANSFERDETAIL');
            table.create = false;
            table.columns.add('STOCKSTRANSFERID', sql.BigInt, { nullable: true });
            table.columns.add('PRODUCTID', sql.BigInt, { nullable: true });
            table.columns.add('PRICE', sql.VarChar(50), { nullable: true });
            table.columns.add('UNITID', sql.Int, { nullable: true });
            table.columns.add('CREATEDUSER', sql.VarChar(50), { nullable: true });
            table.columns.add('CREATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('STOCKSDETAILID', sql.BigInt, { nullable: true });
            table.columns.add('PRODUCTIMEICODE', sql.VarChar(50), { nullable: true });
            table.columns.add('MATERIALIMEICODE', sql.VarChar(50), { nullable: true });
            table.columns.add('NOTE', sql.NVarChar(sql.MAX), { nullable: true });
            table.columns.add('MATERIALID', sql.BigInt, { nullable: true });

            for (let i = 0; i < product_detail_list.length; i++) {
                let _product = product_detail_list[i];
                table.rows.add(
                    stocksTransferId, //STOCKSTRANSFERID
                    _product.product_id,
                    _product.total_price,
                    _product.unit_id,
                    apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'), //CREATEDUSER
                    new Date(), //CREATEDDATE
                    _product.stocks_detail_id, //STOCKSDETAILID
                    _product.product_imei, //PRODUCTIMEICODE,
                    _product.material_imei, //MATERIALIMEICODE,
                    _product.note, //NOTE
                    _product.material_id, //MATERIALID
                );
            }
            const reqStocksTransferDetail = new sql.Request(transaction);
            const results = await reqStocksTransferDetail.bulk(table);
            console.log(`ST_STOCKSTRANSFERDETAIL rows affected ${results.rowsAffected}`);

            // Chuuyển toàn bộ imei sản phẩm hoặc link kiện qua trạng thái là chuyển kho
            if (results.rowsAffected == product_detail_list.length) {
                const updateStatusIMEI = new sql.Request(transaction);
                await updateStatusIMEI
                    .input('STOCKSTRANSFERID', stocksTransferId)
                    .input('STOCKID', apiHelper.getValueFromObject(bodyParams, 'stocks_export_id'))
                    .input('STATUS', 1)
                    .execute('ST_STOCKSTRANSFERDETAIL_updateStatusProductTransfer_AdminWeb');
            }
        }

        // insert table ST_STOCKSTRANSFER_APPLY_REVIEWLEVEL
        const list_review_level = apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_review_list');
        if (list_review_level && list_review_level.length > 0) {
            const requestStocksTranReviewLevel = new sql.Request(transaction);
            for (let i = 0; i < list_review_level.length; i++) {
                let item = list_review_level[i];
                if (item) {
                    const dataStocksTranReviewLevel = await requestStocksTranReviewLevel // eslint-disable-line no-await-in-loop
                        .input('STOCKSTRANSFERID', stocksTransferId)
                        .input(
                            'STOCKSTRANSREVIEWLISTID',
                            apiHelper.getValueFromObject(item, 'stocks_trans_review_list_id'),
                        )
                        .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(item, 'stocks_review_level_id'))
                        .input('USERNAME', apiHelper.getValueFromObject(item, 'review_user'))
                        .input('AUTOREVIEW', apiHelper.getValueFromObject(item, 'is_auto_review'))
                        .input('ISCOMPLETEDREVIEWED', apiHelper.getValueFromObject(item, 'is_completed_reviewed'))
                        .input('ISREVIEWED', apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
                        .input('NOTE', apiHelper.getValueFromObject(item, 'review_note'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('ST_STOCKSTRANS_REVIEWLIST_CreateOrUpdate_AdminWeb');
                    const stocksTransferReviewId = dataStocksTranReviewLevel.recordset[0].RESULT;
                    if (!!dataStocksTranReviewLevel) {
                        if (stocksTransferReviewId <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, e.message);
                        }
                    }
                }
            }
        }

        if (stocksTransferId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi không thể tạo phiếu chuyển kho');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'create success', stocksTransferId);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.createOrUpdateStocksTransfer' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const detailStocksTransfer = async (queryParams = {}) => {
    try {
        const authName = apiHelper.getValueFromObject(queryParams, 'auth_name');
        const pool = await mssql.pool;
        const stocks_transfer_id = apiHelper.getValueFromObject(queryParams, 'stocks_transfer_id');
        const data = await pool
            .request()
            .input('STOCKSTRANSFERID', stocks_transfer_id)
            .execute('ST_STOCKSTRANSFER_GetById_AdminWeb');
        let stocksTransfer = data.recordset;

        if (stocksTransfer && stocksTransfer.length > 0) {
            stocksTransfer = stocksTransferClass.detail(stocksTransfer[0]);

            stocksTransfer.store_export = {
                value: stocksTransfer.store_export,
                label: stocksTransfer.store_export_name,
            };

            stocksTransfer.store_import_id = {
                value: stocksTransfer.store_import_id,
                label: stocksTransfer.store_import_name,
            };

            stocksTransfer.store_id = stocksTransfer.store_import_id;

            stocksTransfer.request_user = {
                value: stocksTransfer.request_user,
                label: stocksTransfer.request_user_name,
            };

            stocksTransfer.import_user_id = {
                value: stocksTransfer.import_user_id,
                label: stocksTransfer.import_user_name,
            };

            stocksTransfer.export_user_id = {
                value: stocksTransfer.export_user_id,
                label: stocksTransfer.export_user_name,
            };

            stocksTransfer.stocks_export_id = parseInt(stocksTransfer.stocks_export_id);

            stocksTransfer.stocks_import_id = parseInt(stocksTransfer.stocks_import_id);

            if (stocksTransfer.estimate_delivery_time) {
                stocksTransfer.estimate_delivery_time = moment(
                    stocksTransfer.estimate_delivery_time,
                    'MMM D YYYY h:mmA',
                ).format('HH:mm A DD/MM/YYYY');
            }

            if (stocksTransfer.actual_delivery_time) {
                stocksTransfer.actual_delivery_time = moment(
                    stocksTransfer.actual_delivery_time,
                    'MMM D YYYY h:mmA',
                ).format('HH:mm A DD/MM/YYYY');
            }

            stocksTransfer.stocks_import_id = parseInt(stocksTransfer.stocks_import_id);

            // Lấy danh sách sản phẩm chuyển kho
            const product_transfer = stocksTransferClass.listProduct(data.recordsets[1]);

            // stocksTransfer.product_transfer = product_transfer.reduce((a, v) => ({ ...a, [v.imei]: v }), {});
            const output = [];
            product_transfer.forEach(function (item, index) {
                const existing = output.filter(function (v, i) {
                    return v.product_id == item.product_id;
                });
                if (existing.length) {
                    const existingIndex = output.indexOf(existing[0]);
                    output[existingIndex].imei = output[existingIndex].imei.concat(item?.imei);
                    output[existingIndex].stock_detail_ids = output[existingIndex].stock_detail_ids.concat([
                        item?.stocks_detail_id,
                    ]);
                    output[existingIndex].price = item?.price || 0;
                    output[existingIndex].quantity += item?.quantity;
                } else {
                    if (typeof item.imei == 'string') item.imei = [item.imei];
                    item.stock_detail_ids = [item.stocks_detail_id];
                    output.push(item);
                }
            });
            stocksTransfer.product_transfer = output;

            // Lấy danh sách duyệt của phiếu chuyển kho
            let { stocksTransferType = [] } = (await genReviewLevel(stocksTransfer.stocks_transfer_type_id)).data || [];

            stocksTransfer.stocks_transfer_review_list = stocksTransferClass.listRLDetail(data.recordsets[2]);

            if (stocksTransferType && stocksTransferType.length) {
                for (let i = 0; i < stocksTransferType.length; i++) {
                    let item = stocksTransferType[i];

                    for (let k = 0; k < stocksTransfer.stocks_transfer_review_list.length; k++) {
                        let item_review = stocksTransfer.stocks_transfer_review_list[k];

                        if (item_review.stocks_review_level_id == item.stocks_review_level_id) {
                            stocksTransfer.stocks_transfer_review_list[k].users = item.users;
                            stocksTransfer.stocks_transfer_review_list[k].is_can_review = item_review.review_user
                                ? item_review.review_user == authName
                                    ? 1
                                    : 0
                                : 0;
                        }

                        // Kiểm tra xem vị trí trước nó đã duyệt hay chưa
                        //===> nếu đã duyệt thì mới cho phép duyệt
                        //===> nếu chưa thì không cho phép duyệt
                        //===> bỏ qua nếu nó là vị trí số không
                        if (k > 0) {
                            // lấy trạng thái duyệt của vị trí trước đó
                            let review_prev = stocksTransfer.stocks_transfer_review_list[k - 1];
                            if (review_prev.is_reviewed === 2) {
                                stocksTransfer.stocks_transfer_review_list[k].is_can_review = 0;
                            }
                        }
                    }
                }
            }

            // Kiem tra phiếu xuất kho dang duyet hay khong
            if (
                stocksTransfer.reviewed_status == 2 &&
                (stocksTransfer.stocks_transfer_review_list || []).filter((x) => !x.is_auto_review && x.review_date)
                    .length
            ) {
                stocksTransfer.reviewed_status = 3; // dang duyet
            }

            return new ServiceResponse(true, '', stocksTransfer);
        }
        return new ServiceResponse(false, 'NOT_FOUND');
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getStocksOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getUserOpts = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', +apiHelper.getValueFromObject(queryParams, 'department_id', 0))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id', 0))
            .input('STOREID', +(apiHelper.getValueFromObject(queryParams, 'store_id')?.value ?? 0))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOCKID', +apiHelper.getValueFromObject(queryParams, 'stocks_id', 0))
            .execute('ST_STOCKSTRANSFER_getUserOptions_AdminWeb');
        return new ServiceResponse(
            true,
            '',
            data.recordset && data.recordset.length ? stocksTransferClass.options(data.recordset) : [],
        );
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getStocksOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getSysOpts = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', +apiHelper.getValueFromObject(queryParams, 'department_id', 0))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id', 0))
            .input('STOREID', +(apiHelper.getValueFromObject(queryParams, 'store_id')?.value ?? 0))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOCKID', +apiHelper.getValueFromObject(queryParams, 'stocks_id', 0))
            .execute('ST_STOCKSTRANSFER_getSysUserOptions_AdminWeb');
        return new ServiceResponse(
            true,
            '',
            data.recordset && data.recordset.length ? stocksTransferClass.options(data.recordset) : [],
        );
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getStocksOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const deleteStocksTransfer = async (stocks_transfer_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSTRANSFERID', stocks_transfer_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTRANSFER_delete_AdminWeb');

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.deleteStocksTransfer' });
        return new ServiceResponse(false, e.message);
    }
};

const genStocksTransferCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSTRANSFER_GenStocksTransferCode_AdminWeb');
        let stocksTransferCode = data.recordset;
        if (stocksTransferCode && stocksTransferCode.length > 0) {
            stocksTransferCode = stocksTransferClass.stocksTransferCode(stocksTransferCode[0]);
            return new ServiceResponse(true, '', stocksTransferCode);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksTransferService.genStocksTransferCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getProductTransfer = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOCKID', apiHelper.getValueFromObject(queryParams, 'stock_id'))
            .execute('ST_STOCKSTRANSFER_getListProduct_AdminWeb');

        const item = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksTransferClass.listProduct(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getProductTransfer' });
        return new ServiceResponse(true, '', {});
    }
};

const genReviewLevel = async (stocks_transfer_type_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTRANSFERTYPEID', stocks_transfer_type_id)
            .execute('ST_STOCKSTRANSFERTYPE_REVIEWLEVEL_GetByStocksTransferTypeId_AdminWeb');
        let stocksTransferType = data.recordset;

        let is_auto_review_stock_transfer =
            data &&
                data.recordset &&
                data.recordset.length > 0 &&
                data.recordset[0] &&
                data.recordset[0].ISREVIEWSTOCKTRANSER
                ? data.recordset[0].ISREVIEWSTOCKTRANSER
                : 0;
        let stocksNewArr = [];

        // If exists
        if (is_auto_review_stock_transfer == 0 && stocksTransferType && stocksTransferType.length > 0) {
            stocksTransferType = stocksTransferClass.detail(stocksTransferType[0]);
            stocksTransferType.review_level_list = stocksTransferClass.listReviewLevel(data.recordset);

            if (stocksTransferType.review_level_list) {
                for (let i = 0; i < stocksTransferType.review_level_list.length; i++) {
                    stocksTransferType.review_level_list[i].users = [];
                    let item = stocksTransferType.review_level_list[i];
                    var index = stocksNewArr.findIndex((x) => x.stocks_review_level_id == item.stocks_review_level_id);
                    if (index === -1) {
                        stocksNewArr.push({
                            stocks_review_level_id: item.stocks_review_level_id,
                            stocks_review_level_name: item.stocks_review_level_name,
                            department_name: item.department_name,
                            department_id: item.department_id,
                            is_auto_review: item.is_auto_review,
                            is_completed_reviewed: item.is_completed_reviewed,
                            user: item.user_name,
                            review_user: item.user_name,
                            value: item.user_name,
                            id: item.user_name,
                            users: [
                                {
                                    label: `${item.user_name}-${item.fullname}`,
                                    id: item.user_name,
                                    value: item.user_name,
                                    name: `${item.user_name}-${item.fullname}`,
                                },
                            ],
                        });
                    } else {
                        for (let i = 0; i < stocksNewArr.length; i++) {
                            if (stocksNewArr[i].stocks_review_level_id == item.stocks_review_level_id) {
                                stocksNewArr[i].users.push({
                                    label: `${item.user_name}-${item.fullname}`,
                                    id: item.user_name,
                                    value: item.user_name,
                                    name: `${item.user_name}-${item.fullname}`,
                                });
                            }
                        }
                    }
                }
            }
            stocksTransferType = stocksNewArr;
            return new ServiceResponse(true, '', { is_auto_review_stock_transfer, stocksTransferType });
        } else {
            return new ServiceResponse(true, '', { is_auto_review_stock_transfer, stocksTransferType });
        }

        // return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksTransferService.genReviewLevel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const reviewStocksTransferReview = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('STOCKSTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_id'))
            .input('ISREVIEW', 1 * apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'review_note'))
            .output('RESULT', apiHelper.getValueFromObject(bodyParams, 'result'))
            .input('USERNAME', bodyParams.auth_name)
            .execute('ST_STOCKSTRANS_REVIEWLIST_StocksTransfer_Approve_Review_AdminWeb');
        let result = data.output.RESULT;
        if (result && result != 1) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSTRANSFER.APPROVE_UNNOW);
        }
        return new ServiceResponse(true, RESPONSE_MSG.STOCKSTRANSFER.APPROVE_SUCCESS);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.reviewStocksTransferReview' });
        return new ServiceResponse(false, e.message);
    }
};

const downloadExcel = async () => {
    try {
        //Đơn vị tính
        const serviceUnit = await unitService.getListUnit({ itemsPerPage: 100 });
        let { data: dataUnit } = serviceUnit.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '262626',
            },
            alignment: {
                horizontal: 'center',
            },
        });

        const columnStyle = wb.createStyle({
            alignment: {
                horizontal: 'center',
            },
        });
        // Add Worksheets SẢN PHẨM
        const ws_1 = wb.addWorksheet('DANH SÁCH GIÁ SẢN PHẨM MẪU');
        ws_1.cell(1, 1).string('STT').style(headerStyle);
        ws_1.cell(1, 2).string('ID sản phẩm/Phụ kiện').style(headerStyle);
        ws_1.cell(1, 3).string('Mã sản phẩm/Phụ kiện').style(headerStyle);
        ws_1.cell(1, 4).string('Tên sản phẩm').style(headerStyle);
        ws_1.cell(1, 5).string('SKU/IMEI*').style(headerStyle);
        ws_1.cell(1, 6).string('Đơn vị tính').style(headerStyle);
        ws_1.cell(1, 7).string('Số lượng').style(headerStyle);
        ws_1.cell(1, 8).string('Đơn giá nhập').style(headerStyle);
        ws_1.cell(1, 9).string('Thành tiền').style(headerStyle);
        ws_1.cell(1, 10).string('Ghi chú').style(headerStyle);
        ws_1.cell(1, 11).string('Là linh kiện').style(headerStyle);

        for (let i = 1; i < 9; i++) {
            ws_1.column(i).setWidth(35);
        }

        // Add Worksheets ĐƠN VỊ TÍNH
        const ws_3 = wb.addWorksheet('ĐƠN VỊ TÍNH');
        ws_3.cell(1, 1).style(headerStyle);
        ws_3.cell(1, 2).style(headerStyle);
        ws_3.cell(1, 3).style(headerStyle);
        ws_3.cell(1, 4).style(headerStyle);

        ws_3.column(1).setWidth(10);
        ws_3.column(2).setWidth(15);
        ws_3.column(3).setWidth(20);
        ws_3.column(4).setWidth(30);

        const header3 = {
            no: 'STT',
            unit_id: 'Mã ĐVT',
            unit_name: 'Tên ĐVT',
            description: 'Mô tả',
        };

        dataUnit.unshift(header3);
        dataUnit.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws_3.cell(indexRow, ++indexCol)
                .string((item.no || index).toString())
                .style(columnStyle);
            ws_3.cell(indexRow, ++indexCol).string((item.unit_id || '').toString());
            ws_3.cell(indexRow, ++indexCol).string((item.unit_name || '').toString());
            ws_3.cell(indexRow, ++indexCol).string((item.description || '').toString());
        });

        // Add Worksheets Lưu ý
        const ws_10 = wb.addWorksheet('Lưu ý');
        ws_10.cell(1, 1).style(headerStyle).string('STT');
        ws_10.cell(1, 2).style(headerStyle).string('Lưu ý');

        ws_10.column(1).setWidth(10);
        ws_10.column(2).setWidth(40);

        ws_10.cell(2, 1).string('1').style(columnStyle);
        ws_10.cell(2, 2).string('Các trường dấu * là bắt buộc ');

        ws_10.cell(3, 1).string('2').style(columnStyle);
        ws_10.cell(3, 2).string('STT nhập sản phẩm bắt đầu từ số 1');

        ws_10.cell(4, 1).string('3').style(columnStyle);
        ws_10.cell(4, 2).string('Mã đơn vị tính quý khách tham chiếu từ sheet "Đơn vị tính"');

        ws_10.cell(5, 1).string('4').style(columnStyle);
        ws_10.cell(5, 2).string('Nếu là nguyên vật liệu thì cột "Là linh kiện" 0 hoặc 1');

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        console.log(error);
        return new ServiceResponse(false, 'Lỗi không thể tải xuống file mẫu', {});
    }
};

const readExcel = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;

        if (bodyParams.path_upload) {
            let rows = await readXlsxFile(bodyParams.path_upload);
            // Kiểm tra xem sản phẩm còn tồn tại số lượng trong kho hay không
            // ==> Lấy ra danh sách imei để kiểm tra

            rows.splice(0, 1);

            let imeiCheckQuantity = rows
                .map((_product, idx) => {
                    return _product[3] + '';
                })
                .join('|');

            if (imeiCheckQuantity) {
                const query = JSON.parse(bodyParams.data);
                const dataCheckIMEI = await pool
                    .request()
                    .input('IMEICHECKQUANTITY', imeiCheckQuantity)
                    .input('STOCKSEXPORTID', query.stock_id || null)

                    .execute('ST_STOCKSTRANSFER_checkProductQuantity_AdminWeb');

                // Kiểm tra nếu như có trả về danh sách imei lỗi dừng thêm mới và trả về danh sách lỗi
                if (dataCheckIMEI && dataCheckIMEI.recordset && dataCheckIMEI.recordset.length >= 1) {
                    return new ServiceResponse(
                        false,
                        'Lỗi sản phẩm không còn tồn kho hoặc đang được xuất.',
                        dataCheckIMEI.recordset[0].IMEIOUTOFSTOCK,
                    );
                }

                const resultData = rows.map((_product, idx) => {
                    return {
                        product_id: _product[10] ? null : _product[1],
                        material_id: _product[10] ? _product[1] : null,
                        product_code: _product[2],
                        product_name: _product[3],
                        imei: _product[4],
                        product_imei: _product[9] ? null : _product[4],
                        material_imei: _product[9] ? _product[4] : null,
                        total_price: _product[7],
                        price: _product[7],
                        lot_number: '',
                        unit_name: '',
                        note: _product[9],
                        quantity: 1,
                    };
                });

                return new ServiceResponse(true, '', resultData);
            }
        }

        return new ServiceResponse(false, 'Lỗi không thể import file xcel', {});
    } catch (e) {
        logger.error(e, {
            function: 'questionService.readExcel',
        });
        return new ServiceResponse(true, e.message);
    }
};

const exportPDF = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const stocks_transfer_id = apiHelper.getValueFromObject(queryParams, 'stocks_transfer_id');

        const data = await pool
            .request()
            .input('STOCKSTRANSFERID', stocks_transfer_id)
            .execute('ST_STOCKSTRANSFER_print_AdminWeb');
        let stocksTransfer = data.recordset;

        if (stocksTransfer && stocksTransfer.length > 0) {
            stocksTransfer = stocksTransferClass.detail(stocksTransfer[0]);
            const product = stocksTransferClass.listProduct(data.recordsets[1]);
            // Lấy danh sách sản phẩm chuyển kho
            const product_transfer = stocksTransferClass.listProduct(data.recordsets[2]);

            stocksTransfer.product_transfer = product_transfer;
            stocksTransfer.product = product?.map((p) => ({
                ...p,
                price: formatCurrency(p.price, 0),
                total_price: formatCurrency(p.total_price, 0),
            }));

            stocksTransfer.total_product = product_transfer.length || 0;

            stocksTransfer.total_money = formatCurrency(
                product.reduce((total, item) => parseInt(item.total_price) + total, 0) || 0,
                0,
            );

            const fileName = `Phieu_chuyen_kho_${moment().format('DDMMYYYY_HHmmss')}_${stocks_transfer_id}`;

            stocksTransfer.created_date = moment().format('DD/MM/YYYY');

            const print_params = {
                template: 'viewStockRotation.html',
                data: stocksTransfer,
                filename: fileName,
            };
            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
        }
        return new ServiceResponse(false, 'NOT_FOUND');
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getStocksOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const confirmTranferProduct = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_id'))
            .input('STOCKSTRANSFERCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_code'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('STOREREQUESTID', apiHelper.getValueFromObject(bodyParams, 'store_request_id'))
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('REQUESTUSER', apiHelper.getValueFromObject(bodyParams, 'request_user')?.value)
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_import_id')?.value)
            .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_import_id'))
            .input('RECEIVER', apiHelper.getValueFromObject(bodyParams, 'import_user_id')?.value)
            .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'import_user_id')?.label)
            .input('FROMSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_export_id'))
            .input('TOSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_import_id'))
            .input('STOREEXPORTID', apiHelper.getValueFromObject(bodyParams, 'store_export_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTRANSFER_confirmTransfer_AdminWeb');

        const result = data.recordsets[2][0].RESULT;

        const TRANSFER_TYPE_CREATE_ORDER = {
            3: 'Chuyển kho khác chi nhánh/tỉnh',
        };
        if (bodyParams.transfer_type in TRANSFER_TYPE_CREATE_ORDER) {
            const orderRes = await createOrder(bodyParams);
            if (orderRes.isFailed()) {
                return new ServiceResponse(false, 'Lỗi tạo đơn hàng');
            }
        }

        if (!result) {
            return new ServiceResponse(false, 'Lỗi tạo phiếu xuất chuyển kho.');
        }
        return new ServiceResponse(true, 'SUCCESS');
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.confirmTranferProduct' });
        return new ServiceResponse(false, e.message);
    }
};

const getAccountingAccount = async (accounting_code) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ACCOUNTINGACCOUNTCODE', accounting_code)
            .execute(`ST_STOCKSTRANSFER_GetAccountingAccount_AdminWeb`);
        return data.recordset?.[0].id;
    } catch (e) {
        logger.error(e, {
            function: 'stocksTransferService.getAccountingAccount',
        });
    }
};

const getOrderType = async (order_type) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERTYPE', order_type)
            .execute(`ST_STOCKSTRANSFER_GetOrderType_AdminWeb`);
        const dataRecord = data.recordset?.[0];
        return new ServiceResponse(true, '', {
            order_type_id: dataRecord?.ORDERTYPEID,
            output_type_id: dataRecord?.OUTPUTTYPEID,
        });
    } catch (e) {
        logger.error(e, {
            function: 'stocksTransferService.getOrderType',
        });
        return new ServiceResponse(false, 'Lỗi lấy thông tin loại đơn hàng', {});
    }
};

const getVatOfOutputType = async (output_type_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OUTPUTTYPEID', output_type_id)
            .execute(`ST_STOCKSTRANSFER_GetVatOfOutputType_AdminWeb`);
        return (data.recordset?.[0].vat_value ?? 0) / 100;
    } catch (e) {
        logger.error(e, {
            function: 'stocksTransferService.getVatOfOutputType',
        });
    }
};

const createOrder = async (bodyParams = {}) => {
    try {
        const {
            product_transfer,
            export_user_name,
            export_business_id,
            import_business_id,
            store_export_id,
            stocks_transfer_code,
            business_import_name,
            business_import_taxcode,
            business_import_email,
            business_import_address,
            stocks_id,
        } = bodyParams;

        const orderNoRes = await orderService.createOrderNo();
        const order_no = orderNoRes.isSuccess() ? orderNoRes.getData() : '';
        const resOrderType = await getOrderType(orderType.INTERNAL);
        if (resOrderType.isFailed()) return new ServiceResponse(false, resOrderType.getMessage());

        const { order_type_id, output_type_id } = resOrderType.getData();
        const vat_value = await getVatOfOutputType(output_type_id);
        for (const product of product_transfer) {
            for (const imei of product?.imei ?? []) {
                const priceRes = await createOrUpdatePrice({
                    ...product,
                    output_type_id,
                    stocks_id,
                    created_user: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
                    product_imei: imei,
                    base_price: product.price,
                    price: product.price * (1 + vat_value),
                });
                if (priceRes.isFailed()) {
                    return new ServiceResponse(false, 'Lỗi tạo giá cho sản phẩm');
                }
            }
        }

        let total_vat = 0,
            total_money_without_vat = 0;
        const product_transfer_custom = {};
        for (const product of product_transfer) {
            const dataProductRes = await orderService.getProduct({
                order_type_id,
                store_id: store_export_id,
                keyword: product.product_imei,
            });
            if (dataProductRes.isFailed()) return new ServiceResponse(false, 'Lỗi lấy thông tin sản phẩm');
            const productFind = dataProductRes.getData()?.[0];
            for (const imei of product?.imei ?? []) {
                total_money_without_vat += product.price;
                const vat_amount = product.price * vat_value;
                total_vat += vat_amount;
                product_transfer_custom[imei] = {
                    ...product,
                    imei_code: imei,
                    product_output_type_id: output_type_id,
                    revenue_account_id: await getAccountingAccount('5112'), // TK Doanh thu: 5112
                    debt_account_id: await getAccountingAccount('136'), // TK: 136
                    tax_account_id: await getAccountingAccount('3331'), // TK Thuế: 3331
                    stock_id: stocks_id,
                    vat_amount,
                    ...productFind,
                    total_price: product.price + vat_amount,
                };
            }
        }
        const payload = {
            ...bodyParams,
            payment_status: 0,
            is_delivery_type: 1,
            order_source: 1,
            total_discount: 0,
            is_discount_percent: 0,
            is_active: 1,

            total_vat, // Tổng VAT
            is_cash_money: 0,
            commissions: [],
            button_type: 'save',
            is_can_stockout: 1,
            is_can_collect_money: 1,
            is_can_create_receiveslip: 1,
            is_can_edit: 1,
            is_plus_point: 1,

            data_payment: [
                {
                    payment_form_id: 22,
                    payment_form_name: 'Tiền Mặt',
                    payment_type: 1,
                    pay_partner_id: null,
                    pay_partner_name: null,
                    pay_partner_full_name: null,
                    pay_partner_code: null,
                    pay_partner_logo: null,
                    payment_value: 0, // Mặc định là 0 khi chưa thanh toán
                    is_checked: true,
                },
                {
                    payment_form_id: 23,
                    payment_form_name: 'Chuyển khoản',
                    payment_type: 2,
                    pay_partner_id: null,
                    pay_partner_name: null,
                    pay_partner_full_name: null,
                    pay_partner_code: null,
                    pay_partner_logo: null,
                    bank_list: [
                        {
                            bank_logo:
                                'https://shopdunk-test.blackwind.vn//file/0aa7e214-5573-4e81-8ba0-6e756735ffc4.jpeg',
                            bank_name: 'Ngân hàng TMCP Công Thương Việt Nam',
                            bank_number: '111002669084',
                            bank_account_name: 'CÔNG TY CỔ PHẦN HESMAN VIỆT NAM SHOPDUNK 143 THÁI HÀ',
                            bank_branch: null,
                            payment_type: 2,
                            bank_id: '52',
                            bank_account_id: 18,
                        },
                    ],
                    payment_value: 0,
                    is_checked: false,
                },
                {
                    payment_form_id: 25,
                    payment_form_name: 'ZaloPay',
                    payment_type: 3,
                    pay_partner_id: 44,
                    pay_partner_name: 'ZALOPAY',
                    pay_partner_full_name: 'Công ty Cổ phần Zion',
                    pay_partner_code: 'ZION',
                    pay_partner_logo: null,
                    payment_value: 0,
                    is_checked: false,
                },
                {
                    payment_form_id: 26,
                    payment_form_name: 'OnePay',
                    payment_type: 3,
                    pay_partner_id: 50,
                    pay_partner_name: 'ONEPAY',
                    pay_partner_full_name: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ TRỰC TUYẾN ONEPAY',
                    pay_partner_code: 'ONEPAY',
                    pay_partner_logo: null,
                    payment_value: 0,
                    is_checked: false,
                },
                {
                    payment_form_id: 28,
                    payment_form_name: 'Payoo',
                    payment_type: 3,
                    pay_partner_id: 49,
                    pay_partner_name: 'PAYOO',
                    pay_partner_full_name: 'CÔNG TY CP DỊCH VỤ TRỰC TUYẾN CỘNG ĐỒNG VIỆT',
                    pay_partner_code: 'PAYOO',
                    pay_partner_logo: null,
                    payment_value: 0,
                    is_checked: false,
                },
                {
                    payment_form_id: 31,
                    payment_form_name: 'Thanh toán ShopeePay',
                    payment_type: 3,
                    pay_partner_id: 47,
                    pay_partner_name: 'SHOPEEPAY',
                    pay_partner_full_name: 'CÔNG TY CỔ PHẦN SHOPEEPAY',
                    pay_partner_code: 'SHOPEEPAY',
                    pay_partner_logo: null,
                    payment_value: 0,
                    is_checked: false,
                },
                {
                    payment_form_id: 35,
                    payment_form_name: 'MOMO',
                    payment_type: 3,
                    pay_partner_id: 45,
                    pay_partner_name: 'MOMO',
                    pay_partner_full_name: 'Công ty Cổ phần Dịch vụ Di động Trực Tuyến(M_SERVICE)',
                    pay_partner_code: 'MOMO',
                    pay_partner_logo: null,
                    payment_value: 0,
                    is_checked: false,
                },
                {
                    payment_form_id: 38,
                    payment_form_name: 'VNPAY',
                    payment_type: 3,
                    pay_partner_id: 45,
                    pay_partner_name: 'MOMO',
                    pay_partner_full_name: 'Công ty Cổ phần Dịch vụ Di động Trực Tuyến(M_SERVICE)',
                    pay_partner_code: 'MOMO',
                    pay_partner_logo: null,
                    payment_value: 0,
                    is_checked: false,
                },
            ],

            return_money: 0,
            order_type_id,
            order_no,
            order_status_id: 22, // Mặc định là đơn hàng mới
            created_user: export_user_name,
            // Thay thế customer bằng thông tin của chi nhánh nhận
            business_receive_id: import_business_id,
            business_transfer_id: export_business_id,

            // Thông tin xuất hàng (Giống thông tin khách hàng)
            store_id: store_export_id, // id cửa hàng chuyển

            // Có mateial và sẽ xử lí sau
            materials: [],
            description: `Đơn hàng chuyển nội bộ theo ${stocks_transfer_code}`,

            // Thông tin khác (Lấy thông tin từ chi nhánh nhận)
            is_invoice: 1,
            invoice_full_name: business_import_name,
            invoice_tax: business_import_taxcode,
            invoice_company_name: business_import_name,
            invoice_email: business_import_email,
            invoice_address: business_import_address,

            products: product_transfer_custom,

            presenter_id: null,
            order_type: orderType.INTERNAL,
            total_money: total_money_without_vat + total_vat,
            total_a_mount: total_money_without_vat + total_vat,
            discount_value: 0,
            discount_coupon: 0,
            promotion_offers: [],
            gifts: [],
            coupon: null,
        };

        console.log('>>> payload', payload);

        const orderRes = await orderService.createOrUpdateOrder(payload);

        if (orderRes.isFailed()) {
            return new ServiceResponse(false, 'Lỗi tạo đơn hàng.');
        }

        return new ServiceResponse(true, 'SUCCESS');
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.createOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdatePrice = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const transaction = await new sql.Transaction(pool);
        await transaction.begin();
        const requestPrice = new sql.Request(transaction);

        const resultPrice = await requestPrice
            .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
            .input('PRICE', apiHelper.getValueFromObject(bodyParams, 'price'))
            .input('BASEPRICE', apiHelper.getValueFromObject(bodyParams, 'base_price'))
            .input('STARTDATE', null)
            .input('ENDDATE', null)
            .input('ISREVIEW', 1)
            .input('ISACTIVE', 1)
            .input('ISOUTPUTFORWEB', 1)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams, 'model_id'))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(bodyParams, 'product_imei'))
            .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_id'))
            .execute('SL_PRICES_CreateOrUpdate');
        const priceId = resultPrice.recordset[0].RESULT;
        if (!priceId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo giá thất bại');
        }

        const requestPriceApply = new sql.Request(transaction);
        const resultPriceApply = await requestPriceApply
            .input('PRICEID', priceId)
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'created_user'))
            .execute('SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS_CreateOrUpdate_AdminWeb');
        const priceApplyId = resultPriceApply.recordset[0].RESULT;

        if (!priceApplyId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo giá thất bại');
        }
        await transaction.commit();
        return new ServiceResponse(true, 'SUCCESS');
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.createOrUpdatePrice' });
        return new ServiceResponse(false, e.message);
    }
};

const checkProductInventory = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const imeiStockStatus = await pool
            .request()
            .input('IMEICHECKQUANTITY', apiHelper.getValueFromObject(bodyParams, 'imies'))
            .execute('ST_STOCKSTRANSFER_CheckProductInventory_AdminWeb');

        return new ServiceResponse(true, 'SUCCESS', imeiStockStatus.recordset);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.checkProductInventory' });
        return new ServiceResponse(false, e.message);
    }
};

const getGeneralStocks = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSTRANSFER_GetGeneralStocks_AdminWeb');
        let result = data.recordset || [];
        if (result) {
            result = stocksTransferClass.generalStocks(result);
            result.forEach((item) => {
                item.managers = JSON.parse(item.managers);
            });
        }

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.getGeneralStocks' });
        return new ServiceResponse(false, e.message);
    }
};

const getStocksByCode = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTRANSFERCODE', apiHelper.getValueFromObject(queryParams, 'request_code'))
            .execute('ST_STOCKSTRANSFER_GetStocksByCode_AdminWeb');
        let result = data.recordset[0] || {};

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.getStocksByCode' });
        return new ServiceResponse(false, e.message);
    }
};

const getProductTransferByImei = async (query) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IMEI', query.imei)
            .input('STOCKID', query.stock_id)
            .execute('ST_STOCKSTRANSFER_getProductTransferByImei_AdminWeb');

        if (!data.recordset[0]) {
            return new ServiceResponse(false, 'Không tìm thấy imei!!');
        }
        return new ServiceResponse(true, '', stocksTransferClass.listProduct(data.recordset[0]));
    } catch (e) {
        logger.error(e, { function: 'stocksTransferService.getProductTransferByImei' });
        return new ServiceResponse(false, e.message);
    }
};

const getInfoStocks = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('ST_STOCKSTRANSFER_GetInfo_AdminWeb');
        const result = stocksTransferClass.infoStock(data.recordset[0])

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.getStocksByCode' });
        return new ServiceResponse(false, e.message);
    }
};

const updateStatusTransfer = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTRANSFERID', apiHelper.getValueFromObject(queryParams, 'stocks_transfer_id'))
            .input('STATUSTRANSFERID', 1)
            .execute('ST_STOCKSTRANSFER_UpdateStatus_AdminWeb');

        return new ServiceResponse(true, '', data);
    } catch (e) {
        logger.error(e, { function: 'stocksTransferTypeService.updateStatusTransfer' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocksTransfer,
    getUserOpts,
    deleteStocksTransfer,
    genStocksTransferCode,
    getProductTransfer,
    genReviewLevel,
    detailStocksTransfer,
    createOrUpdateStocksTransfer,
    reviewStocksTransferReview,
    downloadExcel,
    readExcel,
    exportPDF,
    confirmTranferProduct,
    getProductTransferByImei,
    getGeneralStocks,
    getSysOpts,
    checkProductInventory,
    getStocksByCode,
    getInfoStocks,
    updateStatusTransfer
};
