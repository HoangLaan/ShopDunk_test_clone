const debitService = require('./debit.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');

const getListDebit = async (req, res, next) => {
    try {
        const serviceRes = await debitService.getListDebit(req.query);
        const { items, total, page, limit, statistic } = serviceRes.getData();
        let response = new ListResponse(items, total, page, limit, statistic);
        if (statistic) {
            response.setData({ statistic });
        }
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};

const deleteDebit = async (req, res, next) => {
    try {
        const serviceRes = await debitService.deleteDebit(Object.assign({}, req.params, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'Xóa thành công.'));
    } catch (error) {
        return next(error);
    }
};

const getListPayDebit = async (req, res, next) => {
    try {
        const serviceRes = await debitService.getListPayDebit(req.query);
        const { items, total, page, limit, statistic } = serviceRes.getData();
        return res.json(new ListResponse(items, total, page, limit, statistic));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const serviceRes = await debitService.getById(req.params.debit_id);
        const { items, total, page, limit, statistic } = serviceRes.getData();
        let response = new ListResponse(items, total, page, limit);
        if (statistic) {
            response.setData({ statistic });
        }
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await debitService.exportExcel(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const wb = serviceRes.getData();
        wb.write('pay_debit.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListDebit,
    deleteDebit,
    getListPayDebit,
    getById,
    exportExcel
};
