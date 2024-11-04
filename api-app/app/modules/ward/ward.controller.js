const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const wardService = require ('./ward.service');
/**
 * Get list options ward
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_WARD', req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getByStore = async (req, res, next) => {
  try {
    const serviceRes = await wardService.getByStore({...req.query, ...req.body});
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOptions,
  getByStore
};
