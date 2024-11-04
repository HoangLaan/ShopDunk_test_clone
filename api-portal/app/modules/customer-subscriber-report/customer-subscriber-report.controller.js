const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const customerSubscriberReportService = require('./customer-subscriber-report.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await customerSubscriberReportService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
      const serviceRes = await customerSubscriberReportService.exportExcel(req.body);

      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }

      const wb = serviceRes.getData();
      wb.write('customer.xlsx', res);
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  getList,
  exportExcel
};
