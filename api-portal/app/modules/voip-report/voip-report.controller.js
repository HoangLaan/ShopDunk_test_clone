const SingleResponse = require('../../common/responses/single.response');
const voipReportService = require('./voip-report.service');
const ListResponse = require('../../common/responses/list.response');

/**
 * Get List Cdrs
 */
const getListVoipReport = async (req, res, next) => {
    try {
        const serviceRes = await voipReportService.getListVoipReport(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await voipReportService.exportExcel({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const wb = serviceRes.getData();
        wb.write('reports.xlsx', res);
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListVoipReport,
    exportExcel
}