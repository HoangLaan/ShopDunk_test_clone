const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./installment-partner.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('SL_INSTALLMENTPARTNER_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'InstallmentPartnerService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let installmentPartnerId = apiHelper.getValueFromObject(bodyParams, 'installment_partner_id');

    let isChangeLogo = apiHelper.getValueFromObject(bodyParams, 'is_change_logo');

    let base64 = apiHelper.getValueFromObject(bodyParams, 'installment_partner_logo');
    let logoPath = null;
    if (base64 && isChangeLogo) {
        const result = await fileHelper.saveFile(base64, 'installmentPartner');
        if (result) {
            logoPath = result || null;
        }
    }

    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const resCreateOrUpdateBudget = await request
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .input('INSTALLMENTPARTNERNAME', apiHelper.getValueFromObject(bodyParams, 'installment_partner_name'))
            .input(
                'INSTALLMENTPARTNERCODE',
                apiHelper.getValueFromObject(bodyParams, 'installment_partner_code')?.trim(),
            )
            .input('INSTALLMENTPARTNERLOGO', logoPath)
            .input(
                'INSTALLMENTPARTNERTYPE',
                apiHelper.getValueFromObject(bodyParams, 'installment_partner_type', (BOTH = 3)),
            )
            .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('ADDRESSDETAIL', apiHelper.getValueFromObject(bodyParams, 'address_detail'))
            .input('CONTACTVOCATIVE', apiHelper.getValueFromObject(bodyParams, 'contact_vocative'))
            .input('CONTACTNAME', apiHelper.getValueFromObject(bodyParams, 'contact_name'))
            .input('CONTACTPOSITION', apiHelper.getValueFromObject(bodyParams, 'contact_position'))
            .input('CONTACTPHONE', apiHelper.getValueFromObject(bodyParams, 'contact_phone'))
            .input('SHOPID', apiHelper.getValueFromObject(bodyParams, 'shop_id'))
            .input('PRIVATECODE', apiHelper.getValueFromObject(bodyParams, 'private_code'))
            .input('MERCHANTCODE', apiHelper.getValueFromObject(bodyParams, 'merchant_code'))
            .input('MERCHANTPRIVATECODE', apiHelper.getValueFromObject(bodyParams, 'merchant_private_code'))
            .input('ENDPOINT', apiHelper.getValueFromObject(bodyParams, 'end_point'))
            .input('CHECKINGTYPE', apiHelper.getValueFromObject(bodyParams, 'checking_type'))
            .input('CHECKINGDAY', apiHelper.getValueFromObject(bodyParams, 'checking_day'))
            .input('CHECKINGONWEEKEND', apiHelper.getValueFromObject(bodyParams, 'checking_on_weekend'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
            .input('PAYMENTONWEEKEND', apiHelper.getValueFromObject(bodyParams, 'payment_on_weekend'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .execute('SL_INSTALLMENTPARTNER_CreateOrUpdate_AdminWeb');

        installmentPartnerId = resCreateOrUpdateBudget.recordset[0].RESULT;

        if (!installmentPartnerId) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const createPayPartnerResult = await _createPayPartnerRecord(installmentPartnerId, bodyParams, transaction);
        if (!createPayPartnerResult) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const documentList = apiHelper.getValueFromObject(bodyParams, 'document_list', []);
        const createDocumentResult = await _createOrUpdateDocuments(installmentPartnerId, documentList, transaction);
        if (!createDocumentResult) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const periodList = apiHelper.getValueFromObject(bodyParams, 'period_list', []);
        const createPeriodResult = await _createOrUPdatePeriods(installmentPartnerId, periodList, transaction);
        if (!createPeriodResult) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const paymentList = apiHelper.getValueFromObject(bodyParams, 'payment_list', []);
        const createPaymentResult = await _createOrUPdatePayments(installmentPartnerId, paymentList, transaction);
        if (!createPaymentResult) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        await transaction.commit();
        return new ServiceResponse(true, '', installmentPartnerId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'InstallmentPartnerService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const _createPayPartnerRecord = async (installmentPartnerId, data, transaction) => {
    try {
        const request = new sql.Request(transaction);
        const createRes = await request
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .input('ISACTIVE', apiHelper.getValueFromObject(data, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(data, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
            .execute('MD_PAYPARTNER_CreateOrUpdateInstallmentPartner_AdminWeb');

        if (!createRes.recordset[0]?.RESULT) {
            return false;
        }
        return true;
    } catch (error) {
        logger.error(error, { function: 'InstallmentFormService._createPayPartnerRecord' });
        return false;
    }
};

const _createOrUpdateDocuments = async (installmentPartnerId, data, transaction) => {
    const currentIds = data
        .filter((item) => item.installment_partner_document_id)
        ?.map((item) => item.installment_partner_document_id);

    try {
        // delete
        const request = new sql.Request(transaction);
        const deleteResult = await request
            .input('LISTID', currentIds)
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .execute('SL_INSTALLMENTPARTNER_DOCUMENT_DeleteAllExcept_AdminWeb');
        if (!deleteResult.recordset[0]?.RESULT) {
            return false;
        }
        // insert
        for (const document of data) {
            const request = new sql.Request(transaction);
            const resultChild = await request
                .input(
                    'INSTALLMENTPARTNERDOCUMENTID',
                    apiHelper.getValueFromObject(document, 'installment_partner_document_id'),
                )
                .input('INSTALLMENTPARTNERID', installmentPartnerId)
                .input('DOCUMENTNAME', apiHelper.getValueFromObject(document, 'document_name'))
                .input('ATTACHMENTNAME', apiHelper.getValueFromObject(document, 'attachment_name'))
                .input('ATTACHMENTURL', apiHelper.getValueFromObject(document, 'attachment_url'))
                .execute('SL_INSTALLMENTPARTNER_DOCUMENT_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                return false;
            }
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'InstallmentFormService._createOrUpdateDocuments' });
        return false;
    }
};

const _createOrUPdatePeriods = async (installmentPartnerId, data, transaction) => {
    const currentIds = data
        .filter((item) => item.installment_partner_period_id)
        ?.map((item) => item.installment_partner_period_id);

    try {
        // delete
        const request = new sql.Request(transaction);
        const deleteResult = await request
            .input('LISTID', currentIds)
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .execute('SL_INSTALLMENTPARTNER_PERIOD_DeleteAllExcept_AdminWeb');
        if (!deleteResult.recordset[0]?.RESULT) {
            return false;
        }
        // insert
        for (const period of data) {
            const request = new sql.Request(transaction);
            const resultChild = await request
                .input(
                    'INSTALLMENTPARTNERPERIODID',
                    apiHelper.getValueFromObject(period, 'installment_partner_period_id'),
                )
                .input('INSTALLMENTPARTNERID', installmentPartnerId)
                .input('PERIODVALUE', apiHelper.getValueFromObject(period, 'period_value'))
                .input('PERIODUNIT', apiHelper.getValueFromObject(period, 'period_unit'))
                .input('MINPREPAY', apiHelper.getValueFromObject(period, 'min_prepay'))
                .input('INTERESTRATE', apiHelper.getValueFromObject(period, 'interest_rate'))
                .input('PAYER', apiHelper.getValueFromObject(period, 'payer'))
                .execute('SL_INSTALLMENTPARTNER_PERIOD_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                return false;
            }
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'InstallmentFormService._createOrUPdatePeriods' });
        return false;
    }
};

const _createOrUPdatePayments = async (installmentPartnerId, data, transaction) => {
    const currentIds = data
        .filter((item) => item.installment_partner_payment_id)
        ?.map((item) => item.installment_partner_payment_id);

    try {
        // delete
        const request = new sql.Request(transaction);
        const deleteResult = await request
            .input('LISTID', currentIds)
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .execute('SL_INSTALLMENTPARTNER_PAYMENT_DeleteAllExcept_AdminWeb');
        if (!deleteResult.recordset[0]?.RESULT) {
            return false;
        }
        // insert
        for (const period of data) {
            const request = new sql.Request(transaction);
            const resultChild = await request
                .input(
                    'INSTALLMENTPARTNERPAYMENTID',
                    apiHelper.getValueFromObject(period, 'installment_partner_payment_id'),
                )
                .input('INSTALLMENTPARTNERID', installmentPartnerId)
                .input('ORDERCREATEFROM', apiHelper.getValueFromObject(period, 'order_create_from'))
                .input('ORDERCREATETO', apiHelper.getValueFromObject(period, 'order_create_to'))
                .input('PAYMENTDAY', apiHelper.getValueFromObject(period, 'payment_day'))
                .execute('SL_INSTALLMENTPARTNER_PAYMENT_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                return false;
            }
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'InstallmentFormService._createOrUPdatePayments' });
        return false;
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('INSTALLMENTPARTNERID', id)
            .execute('SL_INSTALLMENTPARTNER_GetById_AdminWeb');

        let installmentPartner = responseData.recordset[0];
        let documentList = responseData.recordsets[1] || [];
        let paymentList = responseData.recordsets[2] || [];
        let periodList = responseData.recordsets[3] || [];

        if (installmentPartner) {
            installmentPartner = moduleClass.detail(installmentPartner);
            installmentPartner.document_list = moduleClass.documentList(documentList);
            installmentPartner.payment_list = moduleClass.paymentList(paymentList);
            installmentPartner.period_list = moduleClass.periodList(periodList);

            return new ServiceResponse(true, '', installmentPartner);
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'InstallmentPartnerService.getDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await transaction.begin();

        if (list_id && list_id.length > 0) {
            for (let id of list_id) {
                const request = new sql.Request(transaction);
                const dataRes = await request
                    .input('INSTALLMENTPARTNERID', id)
                    .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_INSTALLMENTPARTNER_DeleteById_AdminWeb');

                if (!dataRes?.recordset[0]?.RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'failed');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'InstallmentPartnerService.deleteList' });
        return new ServiceResponse(false, e.message);
    }
};

const genCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_INSTALLMENTPARTNER_GenCode_AdminWeb');
        const code = data.recordset[0]?.CODE;
        if (code) {
            return new ServiceResponse(true, '', { code });
        }
        return new ServiceResponse(false, RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, {
            function: 'InstallmentPartnerService.genCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('INSTALLMENTTYPE', apiHelper.getValueFromObject(queryParams, 'installmentType'))
            .execute('SL_INSTALLMENTPARTNER_GetOptions_AdminWeb');
        let results = moduleClass.options(data.recordset || []);

        results = results?.map((item) => {
            item.period_list = JSON.parse(item.period_list);
            item.period_list = item.period_list?.map((period) => ({
                installment_partner_id: period.INSTALLMENTPARTNERID,
                installment_partner_period_id: period.INSTALLMENTPARTNERPERIODID,
                interest_rate: period.INTERESTRATE,
                min_prepay: period.MINPREPAY,
                payer: period.PAYER,
                period_unit: period.PERIODUNIT,
                period_value: period.PERIODVALUE,
                value: period.INSTALLMENTPARTNERPERIODID,
                label: `${period.PERIODVALUE} ${period.PERIODUNIT === 1 ? 'ngày' : 'tháng'} `,
            }));
            return item;
        });

        return new ServiceResponse(true, 'results', results);
    } catch (e) {
        logger.error(e, {
            function: 'InstallmentPartnerService.getOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    deleteList,
    genCode,
    getOptions,
};
