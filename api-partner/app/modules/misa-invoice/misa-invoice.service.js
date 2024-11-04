const moment = require('moment');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const HttpRequest = require('./helper');
const { ITEM_TYPE } = require('./constants');
const moduleCalss = require('./misa-invoice.class');
const { crypto } = require('../../common/helpers/encode.helper');

const getTemplates = async (queryParams = {}) => {
    try {
        queryParams.invyear = queryParams.invyear || moment().year();
        const data = await HttpRequest.get('/code/itg/InvoicePublishing/templates', { params: queryParams });
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.getTemplates' });
        return new ServiceResponse(false, e?.message);
    }
};

const publishingWithHSM = async (bodyParams = {}) => {
    try {
        const caculatedData = await _calculateTotalOC(bodyParams);

        const data = await HttpRequest.post('/code/itg/invoicepublishing/publishhsm', [caculatedData]);
        if (data && data.length > 0) {
            return new ServiceResponse(true, 'success', data[0]);
        }
        return new ServiceResponse(false);
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.publishingWithHSM' });
        return new ServiceResponse(false, e?.message);
    }
};

const viewDemoInvoice = async (bodyParams = {}, store_id) => {
    try {
        const HttpRequest = await getMisaRequest(bodyParams?.auth_name, null, store_id);
        if (HttpRequest) {
            const { OriginalInvoiceData } = await _calculateTotalOC({ OriginalInvoiceData: bodyParams });

            const data = await HttpRequest.post(
                '/code/itg/invoicepublishing/invoicelinkview?type=1',
                OriginalInvoiceData,
            );
            if (data) {
                return new ServiceResponse(true, 'success', data);
            } else {
                return new ServiceResponse(
                    false,
                    'Dữ liệu xem hóa đơn hoặc tài khoản misa không chính xác !',
                    OriginalInvoiceData,
                );
            }
        }
        return new ServiceResponse(false, 'Không tìm thấy tài khoản misa của chi nhánh !');
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.viewDemoInvoice' });
        return new ServiceResponse(false, e?.message);
    }
};

const viewDemoStocksOut = async (bodyParams = {}, stocks_id) => {
    try {
        const HttpRequest = await getMisaRequest(bodyParams?.auth_name, stocks_id);
        if (HttpRequest) {
            const misaAccount = await getDetailMisaAccount(bodyParams?.auth_name, stocks_id);
            const companyData = await HttpRequest.get(`/company?taxcode=${misaAccount.tax_code}`);
            const templates = await HttpRequest.get('/code/itg/InvoicePublishing/templates?invyear=2023');
            const template = templates?.find((template) => {
                return template.InvSeries === process.env.MISA_STOCKSOUT_SERIAL;
            });
            if (template && companyData) {
                _genStocksOutData(bodyParams, template, companyData);

                const data = await HttpRequest.post('/code/itg/invoicepublishing/invoicelinkview?type=1', bodyParams);
                if (data) {
                    return new ServiceResponse(true, 'success', data);
                }
            }
        }
        return new ServiceResponse(false, 'Tài khoản Misa không có mẫu phiếu xuất kho hợp lệ !');
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.viewDemoStocksOut' });
        return new ServiceResponse(false, e?.message);
    }
};

const publishTransportHSM = async (bodyParams = {}, stocks_out_request_id, stocks_id) => {
    try {
        const pool = await mssql.pool;
        const HttpRequest = await getMisaRequest(bodyParams?.auth_name, stocks_id);
        const misaAccount = await getDetailMisaAccount(bodyParams?.auth_name, stocks_id);
        const companyData = await HttpRequest.get(`/company?taxcode=${misaAccount.tax_code}`);
        const templates = await HttpRequest.get('/code/itg/InvoicePublishing/templates?invyear=2023');
        const template = templates?.find((template) => {
            return template.InvSeries === process.env.MISA_STOCKSOUT_SERIAL;
        });
        if (template && companyData) {
            _genStocksOutData(bodyParams.OriginalInvoiceData, template, companyData);

            delete bodyParams.auth_name;
            delete bodyParams.auth_id;

            const data = await HttpRequest.post('/code/itg/invoicepublishing/publishhsm', [bodyParams]);
            if (data && data.length > 0) {
                const result = data[0];
                if (!result.ErrorCode && result.TransactionID) {
                    const { TransactionID } = result;
                    // update database
                    await pool
                        .request()
                        .input('STOCKSOUTREQUESTID', stocks_out_request_id)
                        .input('TRANSACTIONID', TransactionID)
                        .execute('ST_STOCKSOUTREQUEST_UpdateInvoiceStatus_AdminWeb');
                    // view invoice
                    const data = await HttpRequest.post('/invoicepublished/linkview', [TransactionID]);
                    return new ServiceResponse(true, 'success', {
                        view_link: data,
                        transaction_id: TransactionID,
                    });
                } else {
                    return new ServiceResponse(false, result.ErrorCode, result);
                }
            }
        }

        return new ServiceResponse(false, 'Tài khoản Misa không có mẫu phiếu xuất kho hợp lệ !');
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.publishTransportHSM' });
        return new ServiceResponse(false, e?.message);
    }
};

const getInvoiceByRefId = async (refId) => {
    try {
        const data = await HttpRequest.post('/code/invoicepublished/invoice-status/refid', [refId]);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.viewInvoiceByRefId' });
        return new ServiceResponse(false, e?.message);
    }
};

const viewInvoiceByTransactionId = async (transactionId, auth_name) => {
    try {
        const HttpRequest = await getMisaRequest(auth_name);
        const data = await HttpRequest.post('/invoicepublished/linkview', [transactionId]);
        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.viewInvoiceByTransactionId' });
        return new ServiceResponse(false, e?.message);
    }
};

const sendInvoiceToCustomer = async (bodyParams) => {
    try {
        const data = await HttpRequest.post('itg/emails', bodyParams);

        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.sendInvoiceToCustomer' });
        return new ServiceResponse(false, e?.message);
    }
};

const cancelInvoice = async (bodyParams) => {
    try {
        const data = await HttpRequest.post('/code/itg/invoicepublished/cancel', bodyParams);

        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.cancelInvoice' });
        return new ServiceResponse(false, e?.message);
    }
};

const dowloadInvoice = async (transactionId, fileType = 'PDF') => {
    try {
        const data = await HttpRequest.post(`/code/itg/invoicepublished/downloadinvoice?downloadDataType=${fileType}`, [
            transactionId,
        ]);

        return new ServiceResponse(true, 'success', data);
    } catch (e) {
        logger.error(e?.message, { function: 'MisaInvoiceService.dowloadInvoice' });
        return new ServiceResponse(false, e?.message);
    }
};

const _calculateTotalOC = async (params) => {
    const invoiceDetail = params.OriginalInvoiceData.OriginalInvoiceDetail;
    const OriginalInvoiceData = params.OriginalInvoiceData;
    const ExchangeRate = OriginalInvoiceData.ExchangeRate ?? 1;

    OriginalInvoiceData.InvSeries = OriginalInvoiceData.InvSeries ?? process.env.MISA_SERIAL;
    invoiceDetail.forEach((invoice, index) => {
        invoice.LineNumber = invoice.LineNumber ?? index + 1;
        invoice.SortOrder = invoice.SortOrder ?? index + 1;
        invoice.DiscountAmountOC = invoice.DiscountAmount ? invoice.DiscountAmount * ExchangeRate : 0;
        invoice.Amount = invoice.UnitPrice * invoice.Quantity;
        invoice.AmountOC = invoice.Amount * ExchangeRate;
        invoice.AmountWithoutVATOC = invoice.AmountOC - invoice.DiscountAmountOC ?? 0;
        const AmountWithoutVAT = invoice.Amount - invoice.DiscountAmount ?? 0;
        invoice.VATAmount = _calculateVatTax(invoice.VATRateName, AmountWithoutVAT);
        invoice.VATAmountOC = invoice.VATAmount * ExchangeRate;
    });

    // calculate total tax
    const TaxRateInfo = invoiceDetail.reduce((totalTax, invoice) => {
        const previousTax = totalTax.find((_) => _.VATRateName === invoice.VATRateName);
        if (previousTax) {
            previousTax.AmountWithoutVATOC += invoice.AmountWithoutVATOC;
            previousTax.VATAmountOC += invoice.VATAmountOC;
        } else {
            totalTax.push({
                VATRateName: invoice.VATRateName,
                AmountWithoutVATOC: invoice.AmountWithoutVATOC,
                VATAmountOC: invoice.VATAmountOC,
            });
        }
        return totalTax;
    }, []);

    params.OriginalInvoiceData.TaxRateInfo = TaxRateInfo;

    const TotalSaleAmount = invoiceDetail.reduce((total, invoice) => {
        const additionalValue =
            invoice.ItemType === ITEM_TYPE.PRODUCT
                ? invoice.Amount
                : invoice.ItemType === ITEM_TYPE.DISCOUNT
                ? invoice.Amount * -1
                : 0;
        return total + additionalValue;
    }, 0);
    const TotalDiscountAmount =
        params.OriginalInvoiceData.TotalDiscountAmount ??
        invoiceDetail.reduce((total, invoice) => {
            const additionalValue = invoice.ItemType === ITEM_TYPE.DISCOUNT ? invoice.Amount : 0;
            return total + invoice.DiscountAmount ?? 0 + additionalValue;
        }, 0);
    const TotalVATAmount = invoiceDetail.reduce((total, invoice) => {
        const additionalValue =
            invoice.ItemType === ITEM_TYPE.PRODUCT
                ? invoice.VATAmount
                : invoice.ItemType === ITEM_TYPE.DISCOUNT
                ? invoice.VATAmount * -1
                : 0;
        return total + additionalValue;
    }, 0);

    const TotalAmountWithoutVAT =
        TotalSaleAmount -
        invoiceDetail.reduce((total, invoice) => {
            return total + invoice.DiscountAmount ?? 0;
        }, 0);

    const TotalAmount = TotalAmountWithoutVAT + TotalVATAmount;

    OriginalInvoiceData.TotalAmountWithoutVAT = TotalAmountWithoutVAT;
    OriginalInvoiceData.TotalSaleAmount = TotalSaleAmount;
    OriginalInvoiceData.TotalVATAmount = TotalVATAmount;
    OriginalInvoiceData.TotalDiscountAmount = TotalDiscountAmount;
    OriginalInvoiceData.TotalAmount = TotalAmount;

    OriginalInvoiceData.TotalAmountWithoutVATOC = OriginalInvoiceData.TotalAmountWithoutVAT * ExchangeRate;
    OriginalInvoiceData.TotalSaleAmountOC = OriginalInvoiceData.TotalSaleAmount * ExchangeRate;
    OriginalInvoiceData.TotalVATAmountOC = OriginalInvoiceData.TotalVATAmount * ExchangeRate;
    OriginalInvoiceData.TotalDiscountAmountOC = OriginalInvoiceData.TotalDiscountAmount
        ? OriginalInvoiceData.TotalDiscountAmount * ExchangeRate
        : 0;
    OriginalInvoiceData.TotalAmountOC = OriginalInvoiceData.TotalAmount * ExchangeRate;

    OriginalInvoiceData.TotalAmountInWords = await _convertNumberToText(OriginalInvoiceData.TotalAmountOC);

    // handle for tax rate 8%
    if (invoiceDetail.some((invoice) => invoice.VATRateName === '8%')) {
        OriginalInvoiceData.IsTaxReduction43 = true;
    }

    delete params.auth_id;
    delete params.auth_name;
    delete OriginalInvoiceData.auth_id;
    delete OriginalInvoiceData.auth_name;

    return params;
};

const _convertNumberToText = async (money) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('MONEY', money).execute('CBO_COMMON_MoneyToText');

        return data.recordset[0]?.RESULT || '';
    } catch (e) {
        logger.error(e, {
            function: 'MisaInvoiceService._convertNumberToText',
        });
        return '';
    }
};

const _calculateVatTax = (taxName, AmountWithoutVATOC) => {
    let VATPercent;
    if (['0%', 'KCT', 'KKKNT'].includes(taxName)) {
        VATPercent = 0;
    } else if (taxName === '5%') {
        VATPercent = 5;
    } else if (taxName === '8%') {
        VATPercent = 8;
    } else if (taxName === '10%') {
        VATPercent = 10;
    } else {
        const numericPattern = /KHAC:(\d+\.\d{1,2})%/;
        const match = taxName.match(numericPattern);
        if (match) {
            const extractedNumber = match[1];
            VATPercent = Number(extractedNumber);
        } else {
            VATPercent = 0;
        }
    }

    return (AmountWithoutVATOC * VATPercent) / 100;
};

const getDetailMisaAccount = async (username, stocks_id, store_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', username)
            .input('STOCKSID', stocks_id || null)
            .input('STOREID', store_id || null)
            .execute('SL_MISAACCOUNTS_GetById_AdminWeb');

        if (data.recordset && data.recordset.length > 0) {
            const misaAccountData = moduleCalss.detail(data.recordset[0]);
            return new ServiceResponse(true, 'success', misaAccountData);
        }

        return new ServiceResponse(false);
    } catch (e) {
        logger.error(e, { function: 'MisaInvoiceService.getDetailMisaAccount' });
        return new ServiceResponse(false, e?.message);
    }
};

const getMisaRequest = async (username, stocks_id, store_id) => {
    const misaAccount = await getDetailMisaAccount(username, stocks_id, store_id);
    if (misaAccount.isSuccess()) {
        const misaAccountData = misaAccount.getData();
        if (misaAccountData.password) {
            const encodedPassword = crypto.decodeData(misaAccountData.password);
            misaAccountData.password = encodedPassword;
        }
        console.log('🚀 ~ file: misa-invoice.service.js:357 ~ getMisaRequest ~ misaAccountData:', misaAccountData);
        const request = HttpRequest(misaAccountData);
        return request;
    } else {
        throw new Error(
            `Không tìm thấy tài khoản misa được phân cho ${
                stocks_id ? `kho id = ${stocks_id}` : `tài khoản ${username}`
            } !`,
        );
    }
};

const _genStocksOutData = (data, template, companyData) => {
    data.OriginalInvoiceDetail.forEach((item, index) => {
        const totalMoney = Number(item.UnitPrice) * Number(item.Quantity);
        item.LineNumber = index + 1;
        item.SortOrder = index + 1;
        item.Amount = totalMoney;
        item.AmountOC = totalMoney;
        item.AmountWithoutVATOC = totalMoney;
    });

    const totalMoney = data.OriginalInvoiceDetail.reduce((acc, item) => {
        return acc + Number(item.UnitPrice) * Number(item.Quantity);
    }, 0);

    data.TotalAmount = totalMoney;
    data.TotalAmountOC = totalMoney;
    data.StockTotalAmount = totalMoney;
    data.StockTotalAmountOC = totalMoney;
    data.InvoiceName = 'PHIẾU XUẤT KHO KIÊM VẬN CHUYỂN NỘI BỘ';
    data.InternalCommand = data.InternalCommandNo;

    data.InvSeries = template.InvSeries;
    data.InvoiceTemplateID = template.IPTemplateID;
    data.InternalCommandOwner = companyData.CompanyName;
    data.InvDate = moment().format('YYYY-MM-DD');
};

module.exports = {
    getTemplates,
    publishingWithHSM,
    getInvoiceByRefId,
    viewInvoiceByTransactionId,
    sendInvoiceToCustomer,
    cancelInvoice,
    dowloadInvoice,
    viewDemoInvoice,
    viewDemoStocksOut,
    publishTransportHSM,
};
