const stocksOutRequestClass = require('../stocks-out-request/stocks-out-request.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const config = require('../../../config/config');
let xl = require('excel4node');
const { list } = require('../acc-customer-type/acc-customer-type.class');
const fileHelper = require('../../common/helpers/file.helper');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const stocksId = apiHelper.getValueFromObject(queryParams, 'stocks_id', null);
        const stocksOutputTypeId = apiHelper.getValueFromObject(queryParams, 'stocks_out_type_id', null);
        const createUser = apiHelper.getValueFromObject(queryParams, 'created_user', null);
        const isOutputted = apiHelper.getValueFromObject(queryParams, 'is_outputted', 2);
        const isDeleted = apiHelper.getValueFromObject(queryParams, 'is_deleted', 2);
        const isReview = apiHelper.getValueFromObject(queryParams, 'is_review');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date', null))
            .input('STOCKSID', sql.Int, stocksId)
            .input('STOCKSOUTTYPEID', sql.Int, stocksOutputTypeId)
            .input('ISOUTPUTTED', sql.Int, isOutputted)
            .input('ISDELETED', sql.Int, isDeleted)
            .input('CREATEDUSER', createUser)
            .input('ISREVIEW', sql.Int, isReview)
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'auth_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GetList);

        const datas = stocksOutRequestClass.list(data.recordset);
        const datasReview = stocksOutRequestClass.listReviewGetList(data.recordsets[1]);
        return new ServiceResponse(true, '', {
            data: datas.map((p) => ({
                ...p,
                review_list: datasReview.filter((o) => o.stocks_out_request_id === p.stocks_out_request_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getList' });
        return new ServiceResponse(false, '', {});
    }
};

const getListUnit = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETUNIT);
        return data.recordset;
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getListUnit' });
        return [];
    }
};

const getListOutputType = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETOUTPUTTYPE);
        return data.recordset;
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getListOutputType' });
        return [];
    }
};

const getListStocksOutType = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            //.input('STOCKSOUTREQUESTID', apiHelper.getValueFromObject(queryParams, 'stocks_out_request_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETLISTSTOCKSOUTTYPE);

        const datas = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.stocksOutTypeList(datas),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getListStocksOutType' });

        return new ServiceResponse(true, '', {});
    }
};

const getListDetail = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSOUTREQUESTID', apiHelper.getValueFromObject(queryParams, 'stocks_out_request_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_INFODETAIL);

        const datas = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.listDetail(datas),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(datas),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getListDetail' });
        return new ServiceResponse(true, '', {});
    }
};

const getMaxId = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DATEVALUE', apiHelper.getValueFromObject(queryParams, 'date_value'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETMAXIDBYDATE);

        let maxId = data.recordset;
        if (maxId && maxId.length > 0) {
            maxId = stocksOutRequestClass.maxId(maxId[0]);
            return new ServiceResponse(true, '', maxId);
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getMaxId' });
        return new ServiceResponse(true, '', {});
    }
};

const detailStocksOutRequest = async (stocks_out_request_id) => {
    try {
        const pool = await mssql.pool;
        // Thong tin phieu xuat
        const data = await pool
            .request()
            .input('STOCKSOUTREQUESTID', stocks_out_request_id)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETBYID);
            
        // Transform data
        let stocksOutRequest = stocksOutRequestClass.detail(data.recordset[0]);
        let listReview = stocksOutRequestClass.getListUserReviewLevelByStocksOutypeId(data.recordsets[2]);

        const groupBy = (input, key) => {
            return input.reduce((acc, currentValue) => {
                let groupKey = currentValue[key[0]] ?? currentValue[key[1]];
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(currentValue);
                return acc;
            }, {});
        };

        let groupByProductId = groupBy(stocksOutRequestClass.listProductDetail(data.recordsets[1]), [
            'product_id',
            'material_id',
        ]);

        Object.keys(groupByProductId).forEach((key) => {
            const price = groupByProductId[key]?.[0].price;
            const quantity = groupByProductId[key].length;
            groupByProductId[key] = {
                keyObject: key,
                label: groupByProductId[key][0].product_name || groupByProductId[key][0].material_name,
                product_code: groupByProductId[key][0].product_code,
                list_imei: groupByProductId[key]?.filter((o) => o?.product_imei_code || o?.material_imei_code),
                quantity: quantity,
                product_id: groupByProductId[key]?.[0]?.product_id,
                material_id: groupByProductId[key]?.[0].material_id,
                material_code: groupByProductId[key]?.[0].material_code,
                unit_name: groupByProductId[key]?.[0].unit_name,
                price,
                total_money: price * quantity,
                debt_account_id: groupByProductId[key]?.[0].debt_account_id,
                credit_account_id: groupByProductId[key]?.[0].credit_account_id,
                stocks_name: groupByProductId[key]?.[0]?.stocks_name,
            };
        });

        stocksOutRequest.list_review = listReview;
        stocksOutRequest.product_list = groupByProductId;
        stocksOutRequest.images = data.recordsets[3]?.map((o) => o?.IMAGEULR) ?? [];

        // Response
        return new ServiceResponse(true, '', stocksOutRequest);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.detailStocksOutRequest' });
        return new ServiceResponse(false, e.message);
    }
};

// create or update StocksInType
const createStocksOutRequestOrUpdate = async (bodyParams) => {
    // check Images add in varible pictures
    let pictures = [];
    const images = apiHelper.getValueFromObject(bodyParams, 'images');
    if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
            let picture_url;

            if (!images[i].picture_url) {
                if (fileHelper.isBase64(images[i])) {
                    picture_url = await fileHelper.saveBase64(null, images[i]);
                }
            }
            picture_url = picture_url || images[i].picture_url?.replace(config.domain_cdn, '');
            if (picture_url) {
                pictures.push(picture_url);
            }
        }
    }
    const pool = await mssql.pool;
    // #region begin transaction
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const requestStocksOutRequest = new sql.Request(transaction);

        let stocks_out_request_id = apiHelper.getValueFromObject(bodyParams, 'stocks_out_request_id');
        const isEdit = Boolean(stocks_out_request_id);

        const data = await requestStocksOutRequest
            .input('STOCKSOUTREQUESTID', stocks_out_request_id)
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('REQUESTUSER', apiHelper.getValueFromObject(bodyParams, 'request_user'))
            .input('STOCKSOUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_id'))
            .input('FROMSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
            .input('STOCKSOUTREQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_out_request_code')?.trim())
            .input('STOCKSOUTREQUESTDATE', apiHelper.getValueFromObject(bodyParams, new Date(), null))
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id', null))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id', null))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(bodyParams, 'manufacturer_id', null))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number', null))
            .input('STOCKSTAKEREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_take_request_id', null))
            .input('TOSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'to_stocks_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('TOTALAMOUNT', apiHelper.getValueFromObject(bodyParams, 'total_amount'))
            .input('FROMSTOREID', apiHelper.getValueFromObject(bodyParams, 'from_store_id'))
            .input('EXPORTUSER', apiHelper.getValueFromObject(bodyParams, 'export_user'))
            .input('RECEIVER', apiHelper.getValueFromObject(bodyParams, 'receiver', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
            .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))

            .input('PURCHASEUSER', apiHelper.getValueFromObject(bodyParams, 'purchase_user'))
            .input('USERRECEIVER', apiHelper.getValueFromObject(bodyParams, 'user_receiver'))
            .input('ADDRESSRECEIVER', apiHelper.getValueFromObject(bodyParams, 'address_receiver'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
            .input('ISRETURNEDSTOCKS', apiHelper.getValueFromObject(bodyParams, 'is_returned_stocks'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_CREATEORUPDATE);

        const stocksOutRequestId =
            apiHelper.getValueFromObject(bodyParams, 'stocks_out_request_id') ?? data.recordsets[1][0].RESULT;

        if (!stocksOutRequestId) {
            const label = isEdit ? 'Chỉnh sửa' : 'Tạo mới';
            throw Error(label + 'thất bại');
        }

        if (isEdit) {
            let deleteStocksOutMapping = new sql.Request(transaction);
            await deleteStocksOutMapping
                .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUESTDETAIL_DELETE_ADMINWEB);
        }

        const product_detail_list = apiHelper.getValueFromObject(bodyParams, 'product_list');
        //console.log(product_detail_list);
        // #region handle product & component list
        //console.log(product_detail_list);
        if (product_detail_list && product_detail_list.length > 0) {
            for (let i = 0; i < product_detail_list.length; i++) {
                const productDetail = product_detail_list[i];

                const item = product_detail_list[i]?.list_imei ?? [];
                const quantity = product_detail_list[i]?.quantity ?? 0;
                const quantityNull = parseInt(quantity) - item.length;
                if (quantityNull > 0) {
                    const requestCreateProductListNull = new sql.Request(transaction);
                    await requestCreateProductListNull
                        .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                        .input('PRODUCTID', apiHelper.getValueFromObject(product_detail_list[i], 'product_id'))
                        .input('MATERIALID', apiHelper.getValueFromObject(product_detail_list[i], 'material_id'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('QUANTITY', quantityNull)
                        .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
                        .execute('ST_STOCKSOUTREQUEST_CreateOrUpdateDetailImeiNull_AdminWeb');
                }
                if (item.length !== product_detail_list[i].quantity && isEdit) {
                    throw Error('Sản phẩm bị thiếu imei');
                }
                for (const m of item) {
                    const requestCreateProductList = new sql.Request(transaction);
                    await requestCreateProductList
                        .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                        .input('PRODUCTID', apiHelper.getValueFromObject(m, 'product_id'))
                        .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(m, 'product_imei_code'))
                        .input('MATERIALID', apiHelper.getValueFromObject(m, 'material_id'))
                        .input('MATERIALIMEICODE', apiHelper.getValueFromObject(m, 'material_imei_code'))
                        .input('CREDITACCOUNTID', apiHelper.getValueFromObject(productDetail, 'credit_account_id'))
                        .input('DEBTACCOUNTID', apiHelper.getValueFromObject(productDetail, 'debt_account_id'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
                        .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUESTDETAIL_CREATE_ADMINWEB);
                }
            }
        } else {
            throw Error('Vui lòng chọn sản phẩm');
        }

        //#endreigon
        // watch in DB
        const typeStockOut = apiHelper.getValueFromObject(bodyParams, 'type_stock_out');

        if (pictures && pictures.length > 0 && typeStockOut == 6) {
            for (let i = 0; i < pictures.length; i++) {
                const pathUrlPicture = pictures[i];
                const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

                const requestCreateImageStOut = new sql.Request(transaction);
                const resultCreateImageStOut = await requestCreateImageStOut
                    .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                    .input('IMAGEULR', pathUrlPicture)
                    .input('CREATEDUSER', authName)
                    .execute('ST_STOCKSOUTREQUEST_IMAGE_Create_AdminWeb');

                const idResult = resultCreateImageStOut.recordset[0].RESULT;
                if (idResult <= 0) {
                    throw new Error('Thêm hình ảnh không thành công');
                }
            }
        }

        const list_review = apiHelper.getValueFromObject(bodyParams, 'list_review');
        let requestCreateReview = new sql.Request(transaction);
        if (list_review && list_review.length > 0) {
            for (let i = 0; i < list_review.length; i++) {
                let user_review = apiHelper.getValueFromObject(list_review[i], 'user_review', []);
                let item = list_review[i];
                let user_reviewed = (user_review || []).find(
                    (u) => u.user_name == apiHelper.getValueFromObject(item, 'user_name', null),
                );

                const stocks_out_review_list_id =
                    apiHelper.getValueFromObject(user_reviewed, 'stocks_out_review_list_id', null) ??
                    apiHelper.getValueFromObject(item, 'stocks_out_review_list_id', null);
                const stocks_review_level_id =
                    apiHelper.getValueFromObject(user_reviewed, 'stocks_review_level_id', null) ??
                    apiHelper.getValueFromObject(item, 'stocks_review_level_id', null);

                const resultReview = await requestCreateReview
                    .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                    .input('STOCKSOUTREVIEWLISTID', stocks_out_review_list_id)
                    .input('STOCKSREVIEWLEVELID', stocks_review_level_id)
                    .input('USERNAME', apiHelper.getValueFromObject(item, 'user_name', null))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('ISREVIEWED', apiHelper.getValueFromObject(item, 'is_reviewed', null))
                    .input('DESCRIPTION', apiHelper.getValueFromObject(item, 'description', null))
                    .execute('ST_STOCKSOUT_REVIEWLIST_CreateOrUpdate_AdminWeb');

                const result = resultReview.recordset[0].RESULT;
                if (!result) {
                    throw Error('Thêm user review thất bại');
                }
            }
        }
        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'update success', stocksOutRequestId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'stocksOutRequestService.createOrUpdateStocksOutRequest' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteStocksOutRequest = async (stocks_out_request_id, bodyParams) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('STOCKSOUTREQUESTID', stocks_out_request_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_DELETE);

        // removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.deleteStocksOutRequest' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const genDataByStocksOutTypeId = async (stocks_out_type_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSOUTTYPEID', stocks_out_type_id)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETINFO_STOCKSOUTTYPEID_ADMINWEB);
        let StocksOutRequest = data.recordset;
        if (StocksOutRequest && StocksOutRequest.length > 0) {
            StocksOutRequest = stocksOutRequestClass.genDataStocksOutType(StocksOutRequest[0]);
            return new ServiceResponse(true, '', StocksOutRequest);
        }

        return new ServiceResponse(true, '', {});
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.genDataByStocksOutTypeId' });
        return new ServiceResponse(true, '', {});
    }
};

const getStocksManager = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETINFO_STOCKSMANAGER_ADMINWEB);
        let StocksManager = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.getStocksManager(StocksManager),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getStocksManager' });
        return new ServiceResponse(true, '', { data: [] });
    }
};

const getListCustomer = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETLISTCUSTOMER_ADMINWEB);
        let listAccount = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.getListCustomer(listAccount),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getListCustomer' });
        return new ServiceResponse(true, '', {});
    }
};

const getDriverList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('VEHICLESID', apiHelper.getValueFromObject(queryParams, 'vehicles_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETDRIVERBYVEHICLE_ADMINWEB);
        let DriverList = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.listAll(DriverList),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getDriverList' });
        return new ServiceResponse(true, '', { data: [] });
    }
};

const getPhoneNumber = async (driver_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DRIVERID', driver_id)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETPHONENUMBER_ADMINWEB);
        let phoneNumber = data.recordset;
        if (phoneNumber && phoneNumber.length > 0) {
            phoneNumber = stocksOutRequestClass.phoneNumber(phoneNumber[0]);
            return new ServiceResponse(true, '', phoneNumber);
        }
        return new ServiceResponse(true, '', '');
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getPhoneNumber' });
        return new ServiceResponse(true, '', '');
    }
};

const getVehicleList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARTNERTRANSPORTID', apiHelper.getValueFromObject(queryParams, 'partner_transport_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GET_VEHICLE_ADMINWEB);
        let VehicleList = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.listAll(VehicleList),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getVehicleList' });
        return new ServiceResponse(true, '', { data: [] });
    }
};

const stocksOutRequestGenCode = async (params) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSOUTTYPE', parseInt(params?.stocks_out_type_id))
            .output('RETURNCODE', null)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GENCODE_ADMINWEB);
        let StocksOutRequestCode = data.recordset;
        if (StocksOutRequestCode && StocksOutRequestCode.length > 0) {
            StocksOutRequestCode = stocksOutRequestClass.genStocksOutRequestCode(StocksOutRequestCode[0]);
            return new ServiceResponse(true, '', {
                ...StocksOutRequestCode,
                created_user: params?.auth_name,
                stocks_out_request_date: moment(new Date()).format('DD/MM/YYYY'),
                is_reviewed: 'Chưa duyệt',
            });
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.stocksOutRequestGenCode' });
        return new ServiceResponse(false, e.message);
    }
};

const genProductName = async (product_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', product_id)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETPRODUCTNAME_ADMINWEB);
        let StocksOutRequest = data.recordset;
        if (StocksOutRequest && StocksOutRequest.length > 0) {
            StocksOutRequest = stocksOutRequestClass.genProductName(StocksOutRequest[0]);
            return new ServiceResponse(true, '', StocksOutRequest);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.genProductName' });
        return new ServiceResponse(false, e.message);
    }
};

const getProductUnitDensityList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETLISRUNITBYPRODUCTID_ADMINWEB);
        let listProductDensityUnit = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.listProductDensityUnit(listProductDensityUnit),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductUnitDensityList' });
        return new ServiceResponse(true, '', {});
    }
};

const getUnitList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETUNITBYPRODUCTID_ADMINWEB);
        let UnitList = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.listAll(UnitList),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getUnitList' });
        return new ServiceResponse(true, '', { data: [] });
    }
};

const getPriceCost = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(queryParams, 'output_type_id'))
            .input('UNITID', apiHelper.getValueFromObject(queryParams, 'unit_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETPRICECOST_ADMINWEB);
        let listAccount = data.recordset;
        if (listAccount) {
            return new ServiceResponse(true, '', {
                data: stocksOutRequestClass.getPriceCost(listAccount[0]),
            });
        }
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getPriceCost' });
        return new ServiceResponse(true, '', {});
    }
};

// detail StocksInRequest
const detailToPrint = async (stocksOutRequestId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSOUTREQUESTID', stocksOutRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETTOPRINT_ADMINWEB);
        let stocksOutRequest = data.recordsets[0];
        let dataList = data.recordsets[1];
        if (stocksOutRequest && stocksOutRequest.length > 0) {
            stocksOutRequest = stocksOutRequestClass.detail(stocksOutRequest[0]);
            stocksOutRequest.product_detail_list = stocksOutRequestClass.listProductDetailPrint(dataList);
            let description = [];
            try {
                let descriptionJson = JSON.parse(stocksOutRequest.description);
                description = (Object.keys(descriptionJson) || []).reduce((des, item, i) => {
                    des.push(descriptionJson[item]['VALUECONFIG'] || descriptionJson[item]['name'] || '');
                    return des;
                }, []);
            } catch (error) {}
            stocksOutRequest.description = description;

            return new ServiceResponse(true, '', stocksOutRequest);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getList' });
        return new ServiceResponse(false, e.message);
    }
};

// export
const exportPDF = async (stocks_out_request_id) => {
    try {
        const pool = await mssql.pool;
        // Thong tin phieu xuat
        const data = await pool
            .request()
            .input('STOCKSOUTREQUESTID', stocks_out_request_id)
            .execute('ST_STOCKSOUTREQUEST_GetByIdPrint');

        // Transform data
        let stocksOutRequest = stocksOutRequestClass.detail(data.recordset[0]);
        stocksOutRequest.stocks_out_request_date = moment(stocksOutRequest?.stocks_out_request_date).format(
            'DD/MM/YYYY',
        );

        const product_list = data.recordsets[1];
        const product_imei_code = data.recordsets[2];

        stocksOutRequest.product_list = product_list;
        stocksOutRequest.product_imei_code = product_imei_code;
        stocksOutRequest.created_date = moment().format('DD/MM/YYYY');
        //stocksOutRequest.now_date = moment().format('DD/MM/YYYY');

        const fileName = `Phieu_xuat_kho_${moment().format('DDMMYYYY_HHmmss')}`;

        const print_params = {
            template: 'stocksOutExport.html',
            data: stocksOutRequest,
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);

        return new ServiceResponse(true, '', { path: `${config.domain_cdn}pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

// export transport data
const exportTransportPDF = async (stocks_out_request_id) => {
    try {
        const pool = await mssql.pool;
        // Thong tin phieu xuat
        const data = await pool
            .request()
            .input('STOCKSOUTREQUESTID', stocks_out_request_id)
            .execute('ST_STOCKSOUTREQUEST_GetByIdPrintTransport_AdminWeb');

        // Transform data
        let stocksOutRequest = stocksOutRequestClass.printData(data.recordset[0]);

        stocksOutRequest.stocks_out_request_date = moment(stocksOutRequest?.stocks_out_request_date).format(
            'DD/MM/YYYY',
        );

        const product_list = data.recordsets[1];
        const product_imei_code = data.recordsets[2];

        stocksOutRequest.description = `Chuyển hàng ${stocksOutRequest.stocks_name} - ${stocksOutRequest.to_stocks_name}`;
        stocksOutRequest.product_list = product_list;
        stocksOutRequest.product_imei_code = product_imei_code;

        if (stocksOutRequest.stocks_out_request_date) {
            const exportDate = moment(stocksOutRequest.stocks_out_request_date, 'DD/MM/YYYY');
            stocksOutRequest.created_date = `Ngày ${exportDate.format('DD')} tháng ${exportDate.format(
                'MM',
            )} năm ${exportDate.format('YYYY')}`;
        } else {
            stocksOutRequest.created_date = `Ngày tháng năm `;
        }

        stocksOutRequest.stocks_out_request_code = stocksOutRequest.stocks_out_request_code?.replace('PX', 'LDD');

        const fileName = `Lenh_dieu_dong_${moment().format('DDMMYYYY_HHmmss')}`;

        const print_params = {
            template: 'transport.html',
            data: stocksOutRequest,
            filename: fileName,
            isOnlyFirstPage: stocksOutRequest?.product_list.length < 7 ? true : false,
            pageBreak: true,
        };

        await pdfHelper.printPDF(print_params);

        return new ServiceResponse(true, '', { path: `${config.domain_cdn}pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.exportTransportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

// createPartnerTransport
const createPartnerTransport = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARTNERTRANSPORTNAME', apiHelper.getValueFromObject(bodyParams, 'partner_transport_name'))
            .input('LICENSEPLATES', apiHelper.getValueFromObject(bodyParams, 'license_plates'))
            .input('DRIVERNAME', apiHelper.getValueFromObject(bodyParams, 'driver_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSIREQUEST_PARTNERTRANSPORT_CREATE_ADMINWEB);
        const parner_transport_id = data.recordset[0].PARTNERRESULT;

        // listProductUnit.push(coefficientId);
        if (!!data) {
            if (parner_transport_id <= 0) {
                return new ServiceResponse(false, e.message);
            }
        }
        return new ServiceResponse(true, 'update success', data.recordsets);
    } catch (e) {
        logger.error(e, {
            function: 'stocksOutRequestService.createPartnerTransport',
        });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTREQUEST.CREATE_PARTNER_FAILED);
    }
};

const getOptsStocks = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_GETSTOCKS_ADMINWEB);
        return new ServiceResponse(
            true,
            '',
            data.recordset && data.recordset.length ? stocksOutRequestClass.option(data.recordset) : [],
        );
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getOptsStocks' });
        return new ServiceResponse(true, '', []);
    }
};

const getProductOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', queryParams.stocks_id)
            .input('KEYWORD', queryParams.key_word || '')
            .execute('MD_PRODUCT_StocksOutDeboune');

        return new ServiceResponse(
            true,
            '',
            data.recordset && data.recordset.length ? stocksOutRequestClass.productOptions(data.recordset) : [],
        );
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getUsersOfStocksOutRequest = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_request_id'))
            .execute('ST_STOCKSOUTREQUEST_GetUserRequest_AdminWeb');
        return new ServiceResponse(
            true,
            '',
            (data.recordset || []).map((v) => ({
                name: v.FULLNAME,
                id: v.USERID,
                user_name: v.USERNAME,
            })),
        );
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getStocksData = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute('ST_STOCKSOUTREQUEST_GetStocksData_AdminWeb');
        let res = {
            senderOf: stocksOutRequestClass.getStocksManager(data.recordset),
            productOption: stocksOutRequestClass.productOptions(data.recordsets[1]),
        };
        return new ServiceResponse(true, '', res);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getStocksData' });
        return new ServiceResponse(true, '', {});
    }
};

const getProductsInStock = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute('ST_STOCKSOUTREQUEST_GetProductsInStock_AdminWeb');

        return new ServiceResponse(true, '', stocksOutRequestClass.productOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductsInStock' });
        return new ServiceResponse(true, '', []);
    }
};

const getTotalInventoryImei = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const product_id = apiHelper.getValueFromObject(queryParams, 'product_id')
        const resDetail = await detailStocksOutRequest(apiHelper.getValueFromObject(queryParams, 'stocks_out_request_id'))

        let productImeiCode = []
        if (Object.keys(resDetail.data.product_list).length > 0) {
            const dataDetail = resDetail.data.product_list[product_id].list_imei
            dataDetail.forEach(item => {
                productImeiCode.push(item.product_imei_code);
            });
            
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search')?.trim() || '')
            .input('PRODUCTID', product_id)
            .input('MATERIALID', apiHelper.getValueFromObject(queryParams, 'material_id'))
            .input('STOCKSOUTREQUESTID', apiHelper.getValueFromObject(queryParams, 'stocks_out_request_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CODE', productImeiCode?.length > 0 ? productImeiCode.join('|') : null)
            .execute('ST_STOCKSDETAIL_GetTotalInventoryWithProductId_AdminWeb');
            
        return new ServiceResponse(true, '', {
            data: stocksOutRequestClass.listProductImei(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: data.recordset[0]?.TOTALITEMS || 0,
        });
    } catch (e) {
        console.log(e.message);
        logger.error(e, { function: 'stocksOutRequestService.getTotalInventoryImei' });
        return new ServiceResponse(false, '', []);
    }
};

const getListReviewLevelByStocksOutypeId = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSOUTTYPEID', apiHelper.getValueFromObject(queryParams, 'stocks_out_type_id'))
            .execute('ST_STOCKSREVIEWLEVEL_GetByStocksOutTypeId');
        const userList = stocksOutRequestClass.getListUserReviewLevelByStocksOutypeId(data.recordsets[1]);
        return new ServiceResponse(
            true,
            '',
            stocksOutRequestClass.getListReviewLevelByStocksOutypeId(data.recordset).map((e) => {
                return {
                    ...e,
                    user_review: userList.filter((p) => p.stocks_review_level_id === e.stocks_review_level_id),
                };
            }),
        );
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductsInStock' });
        return new ServiceResponse(false, '', []);
    }
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = String(API_CONST.MAX_EXPORT_EXCEL);
    let serviceRes = await getList(queryParams);

    const { data } = serviceRes.getData();

    let wb = new xl.Workbook({
        defaultFont: {
            name: 'Times New Roman',
        },
    });

    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('XUẤT KHO', {});

    // Set height header
    ws.row(1).setHeight(10);
    ws.row(2).setHeight(23);
    ws.row(3).setHeight(23);
    ws.row(4).setHeight(23);
    ws.row(5).setHeight(23);
    ws.row(6).setHeight(23);
    ws.row(7).setHeight(23);
    ws.row(8).setHeight(23);

    // Set width data
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(30);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(20);

    // Khai báo header
    let header = {
        stocks_out_request_code: 'Số phiếu xuất',
        order_no: 'Mã đơn hàng',
        customer_name: 'Khách hàng',
        stocks_out_type_name: 'Hình thức phiếu xuất',
        stocks_name: 'Kho xuất',
        created_user: 'Người lập',
        is_outputted: 'Trạng thái phiếu xuất',
    };

    const countHeader = 8;

    data.unshift(header);

    //options style
    const ColumnsRows = wb.createStyle({
        font: {
            color: 'black',
            size: 16,
            bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FFFFFF',
            fgColor: '#FFFFFF',
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const ColumnsRowDate = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
            bold: true,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center',
        },
    });

    const ColumnsRowValueDate = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const ColumnsRowTotalMoney = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const borderThin = {
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        },
    };

    ws.cell(1, 1, 1, countHeader, true);
    ws.cell(2, 1, 2, countHeader, true).string('XUẤT KHO').style(ColumnsRows);
    ws.cell(3, 1, 3, countHeader, true)
        .string(
            (
                moment().format('h:mm A') +
                ' - ' +
                ' Ngày ' +
                moment().format('DD') +
                ' tháng ' +
                moment().format('MM') +
                ' năm ' +
                moment().format('YYYY')
            ).toString(),
        )
        .style(ColumnsRowTotalMoney);

    data.forEach((item, index) => {
        let indexRow = index + 4;
        let indexCol = 0;
        if (index === 0) {
            ws.row(indexRow).setHeight(30);
            ws.cell(indexRow, ++indexCol).string('STT').style(ColumnsRowDate).style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_out_request_code || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.order_no || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.customer_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_out_type_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.created_user || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.is_outputted || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            return;
        }
        ws.row(indexRow).setHeight(40);
        ws.cell(indexRow, ++indexCol).number(index).style(ColumnsRowValueDate).style(borderThin);
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_out_request_code || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.order_no || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.customer_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_out_type_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.created_user || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.is_outputted || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
    });

    return new ServiceResponse(true, '', wb);
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

const getListCustomerDeboune = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .execute('CRM_ACCOUNT_DebouneSearch');

        return new ServiceResponse(true, '', stocksOutRequestClass.customerListDeboune(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductsInStock' });
        return new ServiceResponse(true, '', []);
    }
};

const getListCreatedUserDebune = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .execute('ST_STOCKSOUTREQUEST_GetListCreateUser_AdminWeb');
        console.log(data.recordset);
        return new ServiceResponse(true, '', stocksOutRequestClass.createUserList(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductsInStock' });
        return new ServiceResponse(false, '', []);
    }
};

const approveOrRejectUpdateStocksout = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input('STOCKSOUTREVIEWLISTID', apiHelper.getValueFromObject(bodyParams, 'stocks_out_review_list_id'))
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .execute('ST_STOCKSOUT_REVIEWLIST_ApproveOrReject_AdminWeb');
        // removeCacheOptions();
        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.deleteStocksOutRequest' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

// XUẤT KHO
const stocksOutputed = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSOUTREQUESTID', queryParams.stocks_out_request_id)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('ST_STOCKSOUTREQUEST_Outputted_AdminWeb');
        return new ServiceResponse(
            true,
            '',
            data.recordset && data.recordset.length ? stocksOutRequestClass.productOptions(data.recordset) : [],
        );
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductOptions' });
        return new ServiceResponse(false, e?.message ?? 'Có lỗi khi xuất');
    }
};

const deleteListStocksOut = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSOUTREQUEST_DeleteList_AdminWeb');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'stocksOutService.deleteListStocksOut' });
        return new ServiceResponse(false, 'Lỗi xoá nhóm phiếu xuất kho');
    }
};

const getOptionsOrders = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(queryParams, 'order_id'))
            .execute('ST_STOCKSOUTREQUEST_GetOptionsOrders_AdminWeb');
        let order_detail = stocksOutRequestClass.optionsOrders(data.recordsets[0][0]);
        let product_list = stocksOutRequestClass.optionsOrdersDetail(data.recordsets[1]);
        product_list = product_list.reduce(
            (a, v) => ({
                ...a,
                [v?.product_id]: { ...v, keyObject: v?.product_id, label: v?.product_name },
            }),
            {},
        );
        if (order_detail) {
            order_detail.product_list = product_list;
            return new ServiceResponse(true, '', order_detail);
        }
        return new ServiceResponse(false, 'Có lỗi xảy ra');
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getOptionsOrders' });
        return new ServiceResponse(true, '', []);
    }
};

const createStocksoutRequestByOrderID = async (params) => {
    const notCheckPayment = params.not_check_payment;

    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const order_id = apiHelper.getValueFromObject(params, 'order_id');
        const created_user = apiHelper.getValueFromObject(params, 'auth_name');

        //kiểm tra đơn hàng đã được thanh toán hết chưa
        const reqCheckPayment = new sql.Request(transaction);
        const resCheckPayment = await reqCheckPayment
            .input('ORDERID', order_id)
            .execute('SL_ORDER_CheckPayment_AdminWeb');

        if (+apiHelper.getResult(resCheckPayment.recordset) === 0 && !notCheckPayment) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Đơn hàng chưa thanh toán');
        }

        const stocksOutRequest = new sql.Request(transaction);

        const response = await stocksOutRequest
            .input('ORDERID', order_id)
            .input('CREATEDUSER', created_user)
            .input('NOTCHECKPAYMENT', notCheckPayment ? 1 : 0) // if true -> create debit for order
            .execute('SL_ORDER_Stocksout_AdminWeb');

        // // Xóa phiếu đã có trước đó theo đơn hàng
        // const reqDeleteStocksOutRequest = new sql.Request(transaction);
        // const resDeleteStocksOutRequest = await reqDeleteStocksOutRequest
        //     .input('ORDERID', order_id)
        //     .input('DELETEDUSER', created_user)
        //     .execute('ST_STOCKSOUTREQUEST_DeleteByOrder_AdminWeb');
        // if (!apiHelper.getResult(resDeleteStocksOutRequest.recordset)) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, 'Có lỗi xảy ra');
        // }
        // //Lấy danh sách kho và sản phẩm trong đơn hàng
        // const reqGetProductByOrderID = new sql.Request(transaction);
        // const resGetProductByOrderID = await reqGetProductByOrderID
        //     .input('ORDERID', order_id)
        //     .execute('SL_ORDERDETAIL_GetByOrderID_AdminWeb');
        // const list_stock = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[0]);
        // const list_order_detail = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[1]);
        // if (list_stock?.length > 0) {
        //     const reqCreateStocksOutRequest = new sql.Request(transaction);
        //     for (const element of list_stock) {
        //         //tạo phiếu xuất kho
        //         const resCreateStocksOutRequest = await reqCreateStocksOutRequest
        //             .input('ORDERID', order_id)
        //             .input('STOCKSID', element.stocks_id)
        //             .input('CREATEDUSER', created_user)
        //             .execute('ST_STOCKSOUTREQUEST_CreateByOrder_AdminWeb');
        //         const stocksOutRequestId = apiHelper.getResult(resCreateStocksOutRequest.recordset);
        //         if (!stocksOutRequestId) {
        //             await transaction.rollback();
        //             return new ServiceResponse(false, 'Có lỗi xảy ra khi tạo phiếu xuất kho');
        //         }

        //         //tạo chi tiết phiếu xuất kho
        //         const reqCreateStocksOutRequestDetail = new sql.Request(transaction);
        //         const resCreateStocksOutRequestDetail = await reqCreateStocksOutRequestDetail
        //             .input('ORDERID', order_id)
        //             .input('STOCKSOUTREQUESTID', stocksOutRequestId)
        //             .input(
        //                 'LISTORDERDETAIL',
        //                 list_order_detail
        //                     .filter((x) => x.stocks_id === element.stocks_id)
        //                     .map((x) => x.order_detail_id)
        //                     .join(','),
        //             )
        //             .input('CREATEDUSER', created_user)
        //             .execute('ST_STOCKSOUTREQUESTDETAIL_CreateByOrder_AdminWeb');
        //         if (!apiHelper.getResult(resCreateStocksOutRequestDetail.recordset)) {
        //             await transaction.rollback();
        //             return new ServiceResponse(false, 'Có lỗi xảy ra khi tạo chi tiết phiếu xuất kho');
        //         }

        //         //xuất kho
        //         const reqExportStocks = new sql.Request(transaction);
        //         await reqExportStocks
        //             .input('STOCKSOUTREQUESTID', stocksOutRequestId)
        //             .input('USERNAME', created_user)
        //             .execute('ST_STOCKSOUTREQUEST_Outputted_AdminWeb');
        //     }
        // } else {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, 'Không tìm thấy sản phẩm trong đơn hàng');
        // }

        await transaction.commit();
        return new ServiceResponse(true, 'Xuất kho thành công ');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'stocksOutRequestService.createStocksoutRequestByOrderID' });
        return new ServiceResponse(false, error);
    }
};

const exportPDFByOrder = async (params) => {
    try {
        const resCreate = await createStocksoutRequestByOrderID(params);
        if (resCreate.isFailed()) {
            return new ServiceResponse(false, resCreate.message);
        }
        const pool = await mssql.pool;
        // Thông tin phiếu xuất
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(params, 'order_id'))
            .input('USERNAME', 10028)
            .execute('ST_STOCKSOUTREQUEST_GetByOrderIdPrint_AdminWeb');
        // Transform data
        let stocksOutRequest = stocksOutRequestClass.detail(data.recordset[0]);
        const product_list = data.recordsets[1];
        const product_imei_code = data.recordsets[2];

        stocksOutRequest.product_list = product_list;
        stocksOutRequest.product_imei_code = product_imei_code;
        stocksOutRequest.created_date = moment().format('DD/MM/YYYY');
        const fileName = `Phieu_xuat_kho_${moment().format('DDMMYYYY_HHmmss')}`;
        const print_params = {
            template: 'stocksOutExport.html',
            data: stocksOutRequest,
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);

        return new ServiceResponse(true, '', { path: `${config.domain_cdn}pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.exportPDFByOrder' });
        return new ServiceResponse(false, e.message || e);
    }
};

const getProductByImei = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOCKSOUTREQUESTID', apiHelper.getValueFromObject(queryParams, 'stocks_out_request_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute('ST_STOCKSDETAIL_GetTotalInventoryWithByImei_AdminWeb');
        return new ServiceResponse(true, '', stocksOutRequestClass.listProductImei(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getProductByImei' });
        return new ServiceResponse(false, '', []);
    }
};

const getStocksOutRequestByOrder = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(queryParams, 'order_id'))
            .execute('ST_STOCKSOUTREQUEST_GetByOrderId_AdminWeb');

        const datas = stocksOutRequestClass.list(data.recordset);
        const datasReview = stocksOutRequestClass.listReviewGetList(data.recordsets[1]);
        return new ServiceResponse(true, '', {
            data: datas.map((p) => ({
                ...p,
                review_list: datasReview.filter((o) => o.stocks_out_request_id === p.stocks_out_request_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.getStocksOutRequestByOrder' });
        return new ServiceResponse(false, '', []);
    }
};

module.exports = {
    getMaxId,
    getList,
    detailStocksOutRequest,
    getListUnit,
    getListOutputType,
    getListStocksOutType,
    getListDetail,
    createStocksOutRequestOrUpdate,
    // createStocksOutRequestOrUpdateDetail,
    deleteStocksOutRequest,
    genDataByStocksOutTypeId,
    getStocksManager,
    getListCustomer,
    getVehicleList,
    getDriverList,
    getPhoneNumber,
    stocksOutRequestGenCode,
    genProductName,
    getProductUnitDensityList,
    getUnitList,
    getPriceCost,
    exportPDF,
    detailToPrint,
    createPartnerTransport,
    getOptsStocks,
    getProductOptions,
    getUsersOfStocksOutRequest,
    getStocksData,
    exportExcel,
    getTotalInventoryImei,
    getListReviewLevelByStocksOutypeId,
    getListCustomerDeboune,
    approveOrRejectUpdateStocksout,
    stocksOutputed,
    getListCreatedUserDebune,
    deleteListStocksOut,
    getOptionsOrders,
    exportPDFByOrder,
    createStocksoutRequestByOrderID,
    getProductByImei,
    getStocksOutRequestByOrder,
    exportTransportPDF,
};
