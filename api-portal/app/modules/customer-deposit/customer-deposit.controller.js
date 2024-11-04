const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const customerDepositService = require('./customer-deposit.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await customerDepositService.getList(req.query);
    const { meta, data, total, page, limit } = serviceRes.getData();
    const listRes = new ListResponse(data, total, page, limit)
    listRes.data.meta = meta
    return res.json(listRes);
  } catch (error) {
    return next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
      const serviceRes = await customerDepositService.exportExcel(req.body);

      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }

      const wb = serviceRes.getData();
      wb.write('customer.xlsx', res);
  } catch (error) {
      return next(error);
  }
};

const updateCall = async (req, res, next) => {
  try {
      const serviceRes = await customerDepositService.updateCall(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  getList,
  exportExcel,
  updateCall,
};
