const httpStatus = require('http-status');
const crmAccountService = require('./account.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');

/**
 * Get list crm account
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListCRMAccount = async (req, res, next) => {
    const authName = req.body.auth_name;
    try {
        const serviceRes = await crmAccountService.getListCRMAccount(req.query, authName);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, listCustomerType } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit, listCustomerType));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// List Customer Optimal
const getListCustomerOptimal = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListCustomerOptimal(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, listCustomerType } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit, listCustomerType));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// Get list latest account
const getListLatestCRMAccount = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListLatestCRMAccount(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, listCustomerType } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit, listCustomerType));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a AM_Business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createCRMAccount = async (req, res, next) => {
    let new_customer_code;
    try {
        const { member_id, customer_code } = req.body;
        // console.log(member_id, customer_code);
        const CustomerCode = await crmAccountService.findByCustomerCode(customer_code, member_id);
        // console.log(CustomerCode)
        // return CustomerCode;
        if (CustomerCode) {
            let num = customer_code.match(/\d+/g);
            let key = customer_code.match(/[a-zA-Z]+/g);
            let newNum = parseInt(num) + 1;
            new_customer_code = key + newNum.toString();
            req.body.customer_code = new_customer_code;
        }

        // Insert CRMAccount
        const serviceRes = await crmAccountService.createCRMAccount(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        if (Number(serviceRes.getData()) === Number(-2))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, '', RESPONSE_MSG.ACCOUNT.CHECK_USENAME_FAILED));
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ACCOUNT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a AM_Business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        // Check CRMAccount exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(member_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update CRMAccount
        const serviceRes = await crmAccountService.updateCRMAccount(req.body, member_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        if (Number(serviceRes.getData()) === Number(-2))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, '', RESPONSE_MSG.ACCOUNT.CHECK_USENAME_FAILED));
        return res.json(new SingleResponse(null, RESPONSE_MSG.ACCOUNT.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
/**
 * delete a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const auth_name = req.auth.user_name;
        // Check ACCOUNT exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(member_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Delete ACCOUNT
        const serviceRes = await crmAccountService.deleteCRMAccount(member_id, auth_name);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.ACCOUNT.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
/**
 * detail a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const detailCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;

        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.detailCRMAccount(member_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailGenCustomerCode = async (req, res, next) => {
    try {
        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.detailGenCustomerCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * change status a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const changeStatusCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const auth_name = req.auth.user_name;
        const is_active = apiHelper.getValueFromObject(req.body, 'is_active');
        // Check function exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(member_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await crmAccountService.changeStatusCRMAccount(member_id, auth_name, is_active);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.ACCOUNT.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const changePassCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;

        // Check function exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(member_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await crmAccountService.changePassCRMAccount(member_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.ACCOUNT.CHANGE_PASSWORD_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 *
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

/**
 * detail a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const getListHistory = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.getListHistory(member_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.exportExcel(req.body);
        const wb = serviceRes.getData();
        wb.write('danh-sach-khach-hang.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getTemplateImport = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getTemplateImport(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('mau-nhap-excel-khach-hang.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const importExcel = async (req, res, next) => {
    try {
        if (!Boolean(req.file)) {
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên'));
        }
        const serviceRes = await crmAccountService.importExcel(req.body, req.file);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListSource = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListSource();
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getListCareer = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListCareer();
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getListProcess = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListProcess();
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getBuyHistoryList = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getBuyHistoryList(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {
            data: { list, statitics },
            total,
            page,
            limit,
        } = serviceRes.getData();
        const resData = new ListResponse(list, total, page, limit);
        resData.data.statitics = statitics;
        return res.json(resData);
    } catch (error) {
        return next(error);
    }
};
const createOrUpdateAddressBook = async (req, res, next) => {
    try {
        // Insert CRMAccount
        const serviceRes = await crmAccountService.createOrUpdateAddressBook(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ACCOUNT.CREATE_ADDRESS_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getListAddress = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.getListAddress(member_id);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const deleteAddress = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.deleteAddress(req.params.member_id, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.REQUEST_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error.message, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const changeDefault = async (req, res, next) => {
    const { member_id } = req.params;
    const { address_id } = req.body;
    try {
        const serviceRes = await crmAccountService.changeDefault({ address_id, member_id });

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.REQUEST_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error.message, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getCustomerTypeHistoryList = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.getCustomerTypeHistoryList(member_id);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getCustomerRepairHistoryList = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.getCustomerRepairHistoryList(member_id, Object.assign(req.query));
        const { data, limit, page, total } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getProductWatchlist = async (req, res, next) => {
    const { member_id } = req.params;
    try {
        const serviceRes = await crmAccountService.getProductWatchlist({ ...req.query, ...{ member_id } });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListHistoryDataLeadsCare = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListHistoryDataLeadsCare(req.query);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

// lấy lịch sử chát của từng user
const getListChatHistoryZalo = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListChatHistoryZalo(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCRMAccountTask = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListCRMAccountTask(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListMemberPoint = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListMemberPoint(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListUserRepair = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListUserRepair(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Delete list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteListAccount = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.deleteListAccount(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá danh sách khách hàng'));
    } catch (error) {
        return next(error);
    }
};

const getOptionsProductAttribute = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getOptionsProductAttribute(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsRelationship = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_RELATIONSHIP', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateHobbiesRelatives = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.updateHobbiesRelatives(member_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getHobbiesRelatives = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.getHobbiesRelatives(member_id);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateAddressBookList = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.updateAddressBookList(member_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getListByUser = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListByUser(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getTaskHistory = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getTaskHistory(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const changeName = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const serviceRes = await crmAccountService.changeName(member_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteHobbiesRelatives = async (req, res, next) => {
    try {
        const account_hobbies_id = req.params.account_hobbies_id;
        const serviceRes = await crmAccountService.deleteHobbiesRelatives(account_hobbies_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListCRMAccount,
    createCRMAccount,
    updateCRMAccount,
    deleteCRMAccount,
    detailCRMAccount,
    detailGenCustomerCode,
    changeStatusCRMAccount,
    changePassCRMAccount,
    getListHistory,
    getListLatestCRMAccount,
    exportExcel,
    getTemplateImport,
    importExcel,
    getListSource,
    getListCareer,
    getListProcess,
    getBuyHistoryList,
    createOrUpdateAddressBook,
    getListAddress,
    deleteAddress,
    changeDefault,
    getCustomerTypeHistoryList,
    getCustomerRepairHistoryList,
    getProductWatchlist,
    getListHistoryDataLeadsCare,
    getListChatHistoryZalo,
    getListCRMAccountTask,
    getListMemberPoint,
    getListUserRepair,
    deleteListAccount,
    getOptionsProductAttribute,
    getOptionsRelationship,
    updateHobbiesRelatives,
    getHobbiesRelatives,
    updateAddressBookList,
    getListByUser,
    getTaskHistory,
    getListCustomerOptimal,
    changeName,
    deleteHobbiesRelatives,
};
