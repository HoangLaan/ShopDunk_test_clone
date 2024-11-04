const stocksOutRequestClass = require('../stocks-out-request/stocks-out-request.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const config = require('../../../config/config');

const createStocksoutRequestByOrderID = async params => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const order_id = apiHelper.getValueFromObject(params, 'order_id');
        const created_user = apiHelper.getValueFromObject(params, 'auth_name');
        const reqCheckPayment = new sql.Request(transaction);
        const resCheckPayment = await reqCheckPayment
            .input('ORDERID', order_id)
            .execute(PROCEDURE_NAME.SL_ORDER_CHECKPAYMENT_APP);
        if (+apiHelper.getResult(resCheckPayment.recordset) === 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Đơn hàng chưa thanh toán');
        }
        // Xóa phiếu đã có trước đó theo đơn hàng 
        const reqDeleteStocksOutRequest = new sql.Request(transaction);
        const resDeleteStocksOutRequest = await reqDeleteStocksOutRequest
            .input('ORDERID', order_id)
            .input('DELETEDUSER', created_user)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_DELETEBYORDER_APP);
        if (!apiHelper.getResult(resDeleteStocksOutRequest.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Có lỗi xảy ra');
        }
        const reqDeleteStocksOutRequestDetail = new sql.Request(transaction);
        const resDeleteStocksOutRequestDetail = await reqDeleteStocksOutRequestDetail
            .input('ORDERID', order_id)
            .input('DELETEDUSER', created_user)
            .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUESTDETAIL_DELETEBYORDER_APP);
        if (!apiHelper.getResult(resDeleteStocksOutRequestDetail.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Có lỗi xảy ra');
        }
        //Lấy danh sách kho và sản phẩm trong đơn hàng
        const reqGetProductByOrderID = new sql.Request(transaction);
        const resGetProductByOrderID = await reqGetProductByOrderID
            .input('ORDERID', order_id)
            .execute(PROCEDURE_NAME.SL_ORDERDETAIL_GETBYORDERID_APP);
        const list_stock = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[0]);
        const list_order_detail = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[1]);

        if (list_stock?.length > 0) {
            const reqCreateStocksOutRequest = new sql.Request(transaction);
            const reqCreateStocksOutRequestDetail = new sql.Request(transaction);

            for (const element of list_stock) {
                const resCreateStocksOutRequest = await reqCreateStocksOutRequest
                    .input('ORDERID', order_id)
                    .input('STOCKSID', element.stocks_id)
                    .input('CREATEDUSER', created_user)
                    .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUEST_CREATEBYORDER_APP);
                const result = apiHelper.getResult(resCreateStocksOutRequest.recordset);
                if (!result) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Có lỗi xảy ra');
                }
                const resCreateStocksOutRequestDetail = await reqCreateStocksOutRequestDetail
                    .input('ORDERID', order_id)
                    .input('STOCKSOUTREQUESTID', result)
                    .input(
                        'LISTORDERDETAIL',
                        list_order_detail
                            .filter(x => x.stocks_id === element.stocks_id)
                            .map(x => x.order_detail_id)
                            .join(','),
                    )
                    .input('CREATEDUSER', created_user)
                    .execute(PROCEDURE_NAME.ST_STOCKSOUTREQUESTDETAIL_CREATEBYORDER_APP);
                if (!apiHelper.getResult(resCreateStocksOutRequestDetail.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Có lỗi xảy ra');
                }
            }
        } else {
            await transaction.rollback();
            return new ServiceResponse(false, 'Không tìm thấy sản phẩm trong đơn hàng');
        }

        await transaction.commit()
        return new ServiceResponse(true, 'Thêm thành công ');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'stocksOutRequestService.createStocksoutRequestByOrderID' });
        return new ServiceResponse(false, error);
    }
};
const exportPDF = async params => {
    try {
        const resCreate = await createStocksoutRequestByOrderID(params);
        if (resCreate.isFailed()) {
            return new ServiceResponse(false, resCreate.message);
        }

        // const pool = await mssql.pool;
        // // Thông tin phiếu xuất
        // const data = await pool
        //     .request()
        //     .input('ORDERID', apiHelper.getValueFromObject(params, 'order_id'))
        //     .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
        //     .execute('ST_STOCKSOUTREQUEST_GetByIdPrint_App');

        // // Transform data
        // let stocksOutRequest = stocksOutRequestClass.detail(data.recordset[0]);
        // const product_list = data.recordsets[1];
        // const product_imei_code = data.recordsets[2];

        // stocksOutRequest.product_list = product_list;
        // stocksOutRequest.product_imei_code = product_imei_code;
        // stocksOutRequest.created_date = moment().format('DD/MM/YYYY');
        // const fileName = `Phieu_xuat_kho_${moment().format('DDMMYYYY_HHmmss')}`;
        // const print_params = {
        //     template: 'stocksOutExport.html',
        //     data: stocksOutRequest,
        //     filename: fileName,
        // };

        // await pdfHelper.printPDF(print_params);

        // return new ServiceResponse(true, '', { path: `${config.domain_cdn}pdf/${fileName}.pdf` });
        return new ServiceResponse(true, 'Tạo phiếu xuất kho thành công', null);

    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'stocksOutRequestService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

module.exports = {
    exportPDF,
};
