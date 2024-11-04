const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const HttpRequest = require('./helper');
const fileHelper = require('../../common/helpers/file.helper');
const mssql = require('../../models/mssql');

const getTemplates = async (queryParams = {}) => {
    try {
        const data = await HttpRequest.get('/misa-invoice/template', { params: queryParams });
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.getTemplates' });
        return new ServiceResponse(false, e?.message);
    }
};

const publishingWithHSM = async (bodyParams = {}) => {
    try {
        const data = await HttpRequest.post('/misa-invoice/publish-with-hsm', bodyParams);

        // update invoice
        if (data && data.RefID) {
            const pool = await mssql.pool;
            await pool
                .request()
                .input('ORDERNO', bodyParams.RefID)
                .input('INVOICEREFID', data.RefID)
                .input('TRANSACTIONCODE', data.TransactionID)
                .input('INVOICETEMPLATENO', data.InvTemplateNo) // Mẫu số
                .input('INVOICESERIES', data.InvSeries) // ký hiệu
                .input('INVOICENO', data.InvNo) // Số hóa đơn
                .input('INVOICEDATE', data.InvDate ? moment(data.InvDate).format('DD/MM/YYYY') : null)
                .input('NOTE', data.ErrorCode)
                .input('CREATEDUSER', bodyParams?.auth_name)
                .execute('SL_ORDER_UpdateOrderInvoiceData_AdminWeb');
        }

        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e?.response?.data?.message, { function: 'MisaInvoiceService.publishingWithHSM' });
        return new ServiceResponse(false, e?.response?.data?.message);
    }
};

const publishTransportHSM = async (bodyParams = {}, store_id) => {
    try {
        const stocks_out_request_id = bodyParams.stocks_out_request_id;
        delete bodyParams.stocks_out_request_id;

        const data = await HttpRequest.post(
            `/misa-invoice/publish-transport-hsm/${stocks_out_request_id}?store_id=${store_id}`,
            bodyParams,
        );
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e?.response?.data?.message, { function: 'MisaInvoiceService.publishTransportHSM' });
        return new ServiceResponse(false, e?.response?.data?.message);
    }
};

const viewDemoInvoice = async (bodyParams = {}, store_id) => {
    try {
        const body = {
            ...bodyParams,
            InvSeries: '1C24THM' //ký hiệu
        }
        
        const data = await HttpRequest.post(`/misa-invoice/view-demo?store_id=${store_id}`, body);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e?.response?.data?.message, { function: 'MisaInvoiceService.viewDemoInvoice' });
        return new ServiceResponse(false, e?.response?.data?.message);
    }
};

const viewDemoStocksOut = async (bodyParams = {}, stocks_id) => {
    try {
        const body = {
            ...bodyParams,
            InvSeries: '6C24NHM'
        }
        const data = await HttpRequest.post(`/misa-invoice/view-demo-transport?stocks_id=${stocks_id}`, body);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e?.response?.data?.message, { function: 'MisaInvoiceService.viewDemoStocksOut' });
        return new ServiceResponse(false, e?.response?.data?.message);
    }
};

const getInvoiceByRefId = async (refId) => {
    try {
        const data = await HttpRequest.get(`/misa-invoice/${refId}`);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.getInvoiceByRefId' });
        return new ServiceResponse(false, e?.message);
    }
};

const viewInvoiceByTransactionId = async (transactionId, auth_name) => {
    try {
        const data = await HttpRequest.get(`/misa-invoice/view/${transactionId}?auth_name=${auth_name}`);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e?.response?.data?.message, { function: 'MisaInvoiceService.viewInvoiceByTransactionId' });
        return new ServiceResponse(false, e?.response?.data?.message);
    }
};

const sendInvoiceToCustomer = async (bodyParams) => {
    try {
        const data = await HttpRequest.post('/misa-invoice/send-mail', bodyParams);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.sendInvoiceToCustomer' });
        return new ServiceResponse(false, e?.message);
    }
};

const cancelInvoice = async (bodyParams) => {
    try {
        const data = await HttpRequest.post('/misa-invoice/cancle', bodyParams);

        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.cancelInvoice' });
        return new ServiceResponse(false, e?.message);
    }
};

const dowloadInvoice = async (transactionId) => {
    try {
        const data = await HttpRequest.post(`/misa-invoice/dowload/${transactionId}`);

        if (data && data.length > 0) {
            return new ServiceResponse(true, 'success', data[0]);
        }
        return new ServiceResponse(false);
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.dowloadInvoice' });
        return new ServiceResponse(false, e?.message);
    }
};

const saveInvoice = async ({ base64, orderId, transactionId }) => {
    try {
        let url = '';
        if (base64) {
            const fileName = 'invoice_' + fileHelper.createGuid() + '.pdf';
            url = await fileHelper.saveLocal('invoice', base64, fileName);
        }

        const pool = await mssql.pool;
        const response = await pool
            .request()
            .input('ORDERID', orderId)
            .input('TRANSACTIONID', transactionId)
            .input('INVOIECURL', url)
            .execute('SL_ORDER_UpdateInvoiceData_AdminWeb');

        if (response.recordset && response.recordset[0]?.RESULT) {
            return new ServiceResponse(true, 'success');
        } else {
            return new ServiceResponse(false, 'Cập nhật đơn hàng xảy ra lỗi !');
        }
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.saveInvoice' });
        return new ServiceResponse(false, e?.message);
    }
};

module.exports = {
    getTemplates,
    publishingWithHSM,
    getInvoiceByRefId,
    viewInvoiceByTransactionId,
    sendInvoiceToCustomer,
    cancelInvoice,
    dowloadInvoice,
    saveInvoice,
    viewDemoInvoice,
    viewDemoStocksOut,
    publishTransportHSM,
};
