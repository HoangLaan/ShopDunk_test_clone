const customerCareService = require('./customer-care.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');

const getList = async (req, res, next) => {
  try {
      const serviceRes = await customerCareService.getList(req.query);
      const {data, total, page, limit} = serviceRes.getData();
      return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};

const getOptionsOrderType = async (req, res, next) => {
  try {
      const serviceRes = await optionService('CRM_CUSTOMERTYPE', req.query);
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
      const serviceRes = await customerCareService.exportExcel(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const dataRes = serviceRes.getData();
      dataRes.write('customer-care.xlsx', res);
  } catch (error) {
      return next(error);
  }
};


module.exports = {
    getList,
    getOptionsOrderType,
    exportExcel,
};
