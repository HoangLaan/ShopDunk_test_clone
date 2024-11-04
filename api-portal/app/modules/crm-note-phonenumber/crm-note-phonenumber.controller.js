const crmNotePhoneNumber = require('./crm-note-phonenumber.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Create
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const createNotePhoneNumber = async (req, res, next) => {
    try {
        const result = await crmNotePhoneNumber.createNotePhoneNumber(req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, 'Lỗi tạo ghi chú phone'));
        }
        return res.json(new SingleResponse(null, 'Tạo thành công'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};


/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getList = async (req, res, next) => {
    try {
        const result = await crmNotePhoneNumber.getListNotePhone({ ...req.query, ...req.body });
        if (result.isFailed()) {
            return next(result);
        }
        const { list, total, page, itemsPerPage } = result.getData();
        return res.json(new ListResponse(list, total, page, itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    createNotePhoneNumber,
    getList
};
