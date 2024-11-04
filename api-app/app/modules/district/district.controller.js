const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const districtService = require ('./district.service');

/**
 * Get list options district
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_DISTRICT', req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getByStore = async (req, res, next) => {
  try {
    const serviceRes = await districtService.getByStore({...req.query, ...req.body});
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOptions,
  getByStore
};
