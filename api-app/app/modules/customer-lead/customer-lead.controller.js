const customerLeadService = require('./customer-lead.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');

const createOrUpdate = async (req, res, next) => {
  try {
      const serviceRes = await customerLeadService.createOrUpdate(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  createOrUpdate,
};
