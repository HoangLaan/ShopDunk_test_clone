const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const invoiceManagementService = require('./invoice-management.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await invoiceManagementService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
    getList,
  };
  